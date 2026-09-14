# -*- coding: utf-8 -*-
"""
Training & Export Script: Model Benchmark Skripsi Hipertensi (Skenario 1 - Clinical Staging)
Studi Kasus: Puskesmas Kembaran 1
Models: Decision Tree & Random Forest Classifier (4-Kelas JNC 7)
"""

import os
import json
import joblib
import numpy as np
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.tree import DecisionTreeClassifier
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score, classification_report
from imblearn.over_sampling import SMOTE

def map_target(val):
    if pd.isna(val) or not isinstance(val, str):
        return np.nan
    v = val.strip().lower()
    if v == 'normal':
        return 0
    elif v in ['pra hipertensi', 'pra-hipertensi', 'prahipertensi']:
        return 1
    elif v in ['hipertensi 1', 'hipertensi derajat 1', 'tingkat 1', 'derajat 1']:
        return 2
    elif v in ['hipertensi 2', 'hipertensi derajat 2', 'tingkat 2', 'derajat 2']:
        return 3
    return np.nan

def train_and_export():
    base_dir = os.path.dirname(os.path.abspath(__file__))
    models_dir = os.path.join(base_dir, 'models')
    os.makedirs(models_dir, exist_ok=True)

    # Look for dataset across relative and absolute locations
    candidates = [
        os.path.abspath(os.path.join(base_dir, '..', '..', '..', 'DATA GABUNGAN CLEAN', 'DATASET_SKRIPSI_GABUNGAN_CLEAN.xlsx')),
        os.path.abspath(os.path.join(base_dir, '..', '..', '..', 'DATA GABUNGAN MENTAH', 'DATASET_SKRIPSI_GABUNGAN_RAW.csv')),
        r'C:\Users\ACER\Downloads\Skripsi Hipertensi\DATA GABUNGAN CLEAN\DATASET_SKRIPSI_GABUNGAN_CLEAN.xlsx',
        r'C:\Users\ACER\Downloads\Skripsi Hipertensi\DATA GABUNGAN MENTAH\DATASET_SKRIPSI_GABUNGAN_RAW.csv'
    ]

    selected_dataset = None
    for c in candidates:
        if os.path.exists(c):
            selected_dataset = c
            break

    if not selected_dataset:
        raise FileNotFoundError(f"Dataset tidak ditemukan di kandidat: {candidates}")

    print(f"[1/5] Memuat dataset dari: {selected_dataset}")
    if selected_dataset.endswith('.xlsx'):
        df = pd.read_excel(selected_dataset)
    else:
        df = pd.read_csv(selected_dataset)

    print(f"      Total data terbaca: {len(df):,} baris")

    # 1. Pembersihan Data & Filter Rentang Klinis Wajar
    print("[2/5] Melakukan pembersihan data & feature engineering...")
    df_clean = df.dropna(subset=['Umur', 'Jenis Kelamin', 'Sistole', 'Diastole', 'Berat Badan (kg)', 'Tinggi Badan (cm)']).copy()
    df_clean = df_clean.drop_duplicates()

    df_clean = df_clean[
        (df_clean['Umur'] > 0) & (df_clean['Umur'] <= 110) &
        (df_clean['Sistole'] >= 60) & (df_clean['Sistole'] <= 250) &
        (df_clean['Diastole'] >= 40) & (df_clean['Diastole'] <= 150)
    ].copy()

    # Hitung IMT jika belum ada atau validasi ulang
    tb_m = df_clean['Tinggi Badan (cm)'] / 100.0
    df_clean['IMT'] = (df_clean['Berat Badan (kg)'] / (tb_m ** 2)).round(2)
    df_clean = df_clean[(df_clean['IMT'] >= 10) & (df_clean['IMT'] <= 60)].copy()

    # Target Mapping
    df_clean['Target_4Class'] = df_clean['Tingkat Hipertensi'].apply(map_target)
    df_clean = df_clean.dropna(subset=['Target_4Class'])
    df_clean['Target_4Class'] = df_clean['Target_4Class'].astype(int)

    # Encodings fitur demografi
    df_clean['JK_Code'] = df_clean['Jenis Kelamin'].map({'Laki-laki': 1, 'Perempuan': 0, 'L': 1, 'P': 0}).fillna(0).astype(int)
    usia_map = {'Remaja': 0, 'Dewasa': 1, 'Lansia': 2, 'Manula': 3}
    df_clean['Kategori_Usia_Code'] = df_clean['Kategori Usia'].map(usia_map).fillna(1).astype(int)

    print(f"      Total data bersih terverifikasi: {len(df_clean):,} baris")
    print(f"      Distribusi kelas target:\n{df_clean['Target_4Class'].value_counts().sort_index()}")

    # 2. Definisi Kumpulan Fitur Skenario 1 (Clinical Staging Model)
    feature_cols = [
        'Umur', 'JK_Code', 'Kategori_Usia_Code',
        'Berat Badan (kg)', 'Tinggi Badan (cm)', 'IMT',
        'Sistole', 'Diastole'
    ]

    X = df_clean[feature_cols]
    y = df_clean['Target_4Class']

    # 3. Stratified Split 80:20 & SMOTE Balancing pada Data Latih
    print("[3/5] Melakukan Stratified Split (80:20), Standarisasi, & SMOTE Balancing...")
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.20, random_state=42, stratify=y
    )

    scaler = StandardScaler()
    X_train_scaled = scaler.fit_transform(X_train)
    X_test_scaled = scaler.transform(X_test)

    smote = SMOTE(random_state=42)
    X_train_resampled, y_train_resampled = smote.fit_resample(X_train_scaled, y_train)
    print(f"      Sampel data latih post-SMOTE: {len(X_train_resampled):,} ({len(X_train_resampled)//4} per kelas)")
    print(f"      Sampel data uji murni: {len(X_test):,}")

    # 4. Pelatihan Model Skenario 1 (Decision Tree & Random Forest)
    print("[4/5] Melatih Decision Tree & Random Forest Classifier...")
    dt_model = DecisionTreeClassifier(random_state=42)
    dt_model.fit(X_train_resampled, y_train_resampled)

    rf_model = RandomForestClassifier(n_estimators=100, random_state=42, n_jobs=-1)
    rf_model.fit(X_train_resampled, y_train_resampled)

    # Evaluasi pada Data Uji Murni (20%)
    y_pred_dt = dt_model.predict(X_test_scaled)
    y_pred_rf = rf_model.predict(X_test_scaled)

    acc_dt = float(accuracy_score(y_test, y_pred_dt))
    f1_dt = float(f1_score(y_test, y_pred_dt, average='macro'))
    prec_dt = float(precision_score(y_test, y_pred_dt, average='macro'))
    rec_dt = float(recall_score(y_test, y_pred_dt, average='macro'))

    acc_rf = float(accuracy_score(y_test, y_pred_rf))
    f1_rf = float(f1_score(y_test, y_pred_rf, average='macro'))
    prec_rf = float(precision_score(y_test, y_pred_rf, average='macro'))
    rec_rf = float(recall_score(y_test, y_pred_rf, average='macro'))

    print("\n========================================================")
    print("HASIL EVALUASI BENCHMARK MODEL (DATA UJI MURNI 20%)")
    print("========================================================")
    print(f"Decision Tree  -> Akurasi: {acc_dt*100:.2f}%, F1-Score: {f1_dt*100:.2f}%, Precision: {prec_dt*100:.2f}%, Recall: {rec_dt*100:.2f}%")
    print(f"Random Forest  -> Akurasi: {acc_rf*100:.2f}%, F1-Score: {f1_rf*100:.2f}%, Precision: {prec_rf*100:.2f}%, Recall: {rec_rf*100:.2f}%")
    print("========================================================\n")

    # 5. Export Artefak Model
    print("[5/5] Menyimpan artefak model ke direktori models/ ...")
    scaler_path = os.path.join(models_dir, 'scaler_hipertensi.pkl')
    dt_path = os.path.join(models_dir, 'model_decision_tree_clinical.pkl')
    rf_path = os.path.join(models_dir, 'model_random_forest_clinical.pkl')
    meta_path = os.path.join(models_dir, 'model_metadata.json')

    joblib.dump(scaler, scaler_path)
    joblib.dump(dt_model, dt_path)
    joblib.dump(rf_model, rf_path)

    metadata = {
        "scenario": "Skenario 1 - Clinical Staging Model",
        "target_classes": {
            "0": "Normal",
            "1": "Pra Hipertensi",
            "2": "Tingkat 1",
            "3": "Tingkat 2"
        },
        "features": feature_cols,
        "metrics": {
            "decision_tree": {
                "accuracy": round(acc_dt * 100, 2),
                "f1_score": round(f1_dt * 100, 2),
                "precision": round(prec_dt * 100, 2),
                "recall": round(rec_dt * 100, 2)
            },
            "random_forest": {
                "accuracy": round(acc_rf * 100, 2),
                "f1_score": round(f1_rf * 100, 2),
                "precision": round(prec_rf * 100, 2),
                "recall": round(rec_rf * 100, 2)
            }
        },
        "train_samples_post_smote": len(X_train_resampled),
        "test_samples": len(X_test),
        "dataset_source": os.path.basename(selected_dataset)
    }

    with open(meta_path, 'w', encoding='utf-8') as f:
        json.dump(metadata, f, indent=2)

    print("[OK] Berhasil menyimpan artefak:")
    print(f"  - {scaler_path}")
    print(f"  - {dt_path}")
    print(f"  - {rf_path}")
    print(f"  - {meta_path}")
    print("\nPelatihan & Ekspor Model Benchmark selesai dengan sukses!")

if __name__ == '__main__':
    train_and_export()
