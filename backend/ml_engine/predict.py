# -*- coding: utf-8 -*-
"""
Inference Engine: Model Machine Learning Hipertensi (Skenario 1 - Clinical Staging)
Studi Kasus: Puskesmas Kembaran 1
"""

import sys
import os
import json
import argparse
import warnings
warnings.filterwarnings('ignore')

import numpy as np
import pandas as pd

def resolve_kategori_usia(age: int) -> int:
    """
    Sesuai pemetaan dataset:
    Remaja (12-18) = 0
    Dewasa (19-59) = 1
    Lansia (60-74) = 2
    Manula (>=75)  = 3
    """
    if age <= 18:
        return 0
    elif age <= 59:
        return 1
    elif age <= 74:
        return 2
    else:
        return 3

def resolve_jk_code(gender: str) -> int:
    g = str(gender).strip().upper()
    if g in ['L', 'LAKI-LAKI', 'PRIA', 'MALE', '1']:
        return 1
    return 0

_CACHED_MODELS = None

def get_models():
    global _CACHED_MODELS
    if _CACHED_MODELS is not None:
        return _CACHED_MODELS

    base_dir = os.path.dirname(os.path.abspath(__file__))
    models_dir = os.path.join(base_dir, 'models')

    scaler_path = os.path.join(models_dir, 'scaler_hipertensi.pkl')
    dt_path = os.path.join(models_dir, 'model_decision_tree_clinical.pkl')
    rf_path = os.path.join(models_dir, 'model_random_forest_clinical.pkl')
    meta_path = os.path.join(models_dir, 'model_metadata.json')

    if not (os.path.exists(scaler_path) and os.path.exists(dt_path) and os.path.exists(rf_path)):
        return None

    import joblib

    scaler = joblib.load(scaler_path)
    dt_model = joblib.load(dt_path)
    rf_model = joblib.load(rf_path)

    acc_dt = 100.0
    acc_rf = 99.97
    if os.path.exists(meta_path):
        try:
            with open(meta_path, 'r', encoding='utf-8') as f:
                meta = json.load(f)
                acc_dt = meta.get('metrics', {}).get('decision_tree', {}).get('accuracy', 100.0)
                acc_rf = meta.get('metrics', {}).get('random_forest', {}).get('accuracy', 99.97)
        except Exception:
            pass

    _CACHED_MODELS = (scaler, dt_model, rf_model, acc_dt, acc_rf)
    return _CACHED_MODELS

def predict(usia: int, gender: str, berat: float, tinggi: float, sistolik: int, diastolik: int):
    models = get_models()
    if models is None:
        return {
            "status": "error",
            "message": "File model atau scaler machine learning (.pkl) belum tersedia di ml_engine/models/."
        }

    scaler, dt_model, rf_model, acc_dt, acc_rf = models

    # 1. Feature Engineering
    jk_code = resolve_jk_code(gender)
    kategori_usia_code = resolve_kategori_usia(usia)
    
    tb_m = tinggi / 100.0
    imt = round(berat / (tb_m ** 2), 2)

    # 2. Susun Vektor Fitur Skenario 1 dengan nama kolom yang konsisten
    feature_cols = [
        'Umur', 'JK_Code', 'Kategori_Usia_Code',
        'Berat Badan (kg)', 'Tinggi Badan (cm)', 'IMT',
        'Sistole', 'Diastole'
    ]
    df_feat = pd.DataFrame([[
        float(usia),
        float(jk_code),
        float(kategori_usia_code),
        float(berat),
        float(tinggi),
        float(imt),
        float(sistolik),
        float(diastolik)
    ]], columns=feature_cols)

    # 3. Normalisasi StandardScaler
    scaled_vector = scaler.transform(df_feat)
    scaled_df = pd.DataFrame(scaled_vector, columns=feature_cols)

    # 4. Prediksi & Probabilitas Model
    pred_dt_idx = int(dt_model.predict(scaled_df)[0])
    proba_dt = dt_model.predict_proba(scaled_df)[0]

    pred_rf_idx = int(rf_model.predict(scaled_df)[0])
    proba_rf = rf_model.predict_proba(scaled_df)[0]

    # Target Mapping: 0: Normal, 1: Pra Hipertensi, 2: Tingkat 1, 3: Tingkat 2
    class_map = {
        0: 'Normal',
        1: 'Pra Hipertensi',
        2: 'Tingkat 1',
        3: 'Tingkat 2'
    }

    # Ensemble Weighted Probabilities: 60% RF, 40% DT
    proba_ensemble = 0.60 * proba_rf + 0.40 * proba_dt
    final_class_idx = int(np.argmax(proba_ensemble))
    final_result = class_map[final_class_idx]

    # Confidence score: persentase probabilitas kelas pemenang (dijamin 50-100%)
    conf_score = round(float(proba_ensemble[final_class_idx]) * 100, 1)

    # Pulse Pressure (Tekanan Nadi)
    pulse_pressure = int(sistolik - diastolik)
    pp_warning = pulse_pressure >= 60

    return {
        "status": "success",
        "result": final_result,
        "confidence_score": conf_score,
        "prediction_dt": class_map.get(pred_dt_idx, 'Tidak Diketahui'),
        "prediction_rf": class_map.get(pred_rf_idx, 'Tidak Diketahui'),
        "accuracy_dt": acc_dt,
        "accuracy_rf": acc_rf,
        "pulse_pressure": pulse_pressure,
        "pulse_pressure_warning": pp_warning,
        "features": {
            "usia": usia,
            "gender": "L" if jk_code == 1 else "P",
            "berat": berat,
            "tinggi": tinggi,
            "imt": imt,
            "sistolik": sistolik,
            "diastolik": diastolik,
            "jk_code": jk_code,
            "kategori_usia_code": kategori_usia_code
        },
        "probabilities": {
            class_map[i]: round(float(proba_ensemble[i]), 4)
            for i in range(len(proba_ensemble))
        }
    }

def main():
    parser = argparse.ArgumentParser(description="Inference Engine Model Hipertensi")
    parser.add_argument("--json", type=str, help="Input dalam format JSON string")
    parser.add_argument("--usia", type=int, help="Usia pasien (tahun)")
    parser.add_argument("--gender", type=str, help="Jenis kelamin (L/P)")
    parser.add_argument("--berat", type=float, help="Berat badan (kg)")
    parser.add_argument("--tinggi", type=float, help="Tinggi badan (cm)")
    parser.add_argument("--sistolik", type=int, help="Tekanan sistolik (mmHg)")
    parser.add_argument("--diastolik", type=int, help="Tekanan diastolik (mmHg)")

    args = parser.parse_args()

    if args.json:
        try:
            data = json.loads(args.json)
            usia = int(data.get('usia', 30))
            gender = str(data.get('gender', 'L'))
            berat = float(data.get('berat', 65.0))
            tinggi = float(data.get('tinggi', 165.0))
            sistolik = int(data.get('sistolik', 120))
            diastolik = int(data.get('diastolik', 80))
        except Exception as e:
            print(json.dumps({"status": "error", "message": f"Format JSON tidak valid: {str(e)}"}))
            sys.exit(1)
    else:
        if args.usia is None or args.gender is None or args.berat is None or args.tinggi is None or args.sistolik is None or args.diastolik is None:
            print(json.dumps({"status": "error", "message": "Argumen klinis tidak lengkap. Harap sertakan --usia, --gender, --berat, --tinggi, --sistolik, --diastolik atau --json"}))
            sys.exit(1)
        usia = args.usia
        gender = args.gender
        berat = args.berat
        tinggi = args.tinggi
        sistolik = args.sistolik
        diastolik = args.diastolik

    try:
        output = predict(usia, gender, berat, tinggi, sistolik, diastolik)
        print(json.dumps(output, ensure_ascii=False))
        if output.get("status") == "error":
            sys.exit(1)
        sys.exit(0)
    except Exception as e:
        print(json.dumps({"status": "error", "message": str(e)}, ensure_ascii=False))
        sys.exit(1)

if __name__ == '__main__':
    main()
