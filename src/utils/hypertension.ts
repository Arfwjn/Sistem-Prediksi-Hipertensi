export type HypertensionLevel = 'Normal' | 'Pra Hipertensi' | 'Tingkat 1' | 'Tingkat 2' | 'Krisis Hipertensi';

export function classifyHypertension(systolic: number, diastolic: number): HypertensionLevel {
  if (systolic >= 180 || diastolic >= 120) {
    return 'Krisis Hipertensi';
  }
  if (systolic >= 160 || diastolic >= 100) {
    return 'Tingkat 2';
  }
  if (systolic >= 140 || diastolic >= 90) {
    return 'Tingkat 1';
  }
  if ((systolic >= 120 && systolic <= 139) || (diastolic >= 80 && diastolic <= 89)) {
    return 'Pra Hipertensi';
  }
  return 'Normal';
}

export function getHypertensionStageDetails(level: HypertensionLevel) {
  switch (level) {
    case 'Normal':
      return {
        range: 'Sistolik < 120 dan Diastolik < 80 mmHg',
        description: 'Tekanan darah Anda berada dalam rentang optimal dan sehat. Pertahankan pola makan seimbang dan gaya hidup aktif.',
        recommendation: 'Lakukan pemeriksaan rutin berkala setahun sekali, pertahankan diet gizi seimbang.'
      };
    case 'Pra Hipertensi':
      return {
        range: 'Sistolik 120-139 atau Diastolik 80-89 mmHg',
        description: 'Tekanan darah cenderung di atas normal. Meskipun belum masuk kategori hipertensi klinis, ini adalah fase peringatan.',
        recommendation: 'Kurangi konsumsi garam/natrium, lakukan olahraga aerobik teratur minimal 150 menit/minggu, kelola stres.'
      };
    case 'Tingkat 1':
      return {
        range: 'Sistolik 140-159 atau Diastolik 90-99 mmHg',
        description: 'Tekanan darah tinggi tingkat awal. Diperlukan perhatian khusus dan modifikasi gaya hidup intensif untuk mencegah perburukan.',
        recommendation: 'Konsultasi ke dokter Puskesmas, evaluasi klinis rutin bulanan, mulai program diet rendah garam DASH secara ketat.'
      };
    case 'Tingkat 2':
      return {
        range: 'Sistolik 160-179 atau Diastolik >= 100 mmHg',
        description: 'Kondisi tekanan darah tinggi yang signifikan. Biasanya memerlukan terapi kombinasi obat antihipertensi dari dokter pendamping.',
        recommendation: 'Konsultasi medis aktif ke dokter spesialis/Puskesmas, kepatuhan terapi obat secara presisi, hindari aktivitas fisik ekstrem.'
      };
    case 'Krisis Hipertensi':
      return {
        range: 'Sistolik >= 180 atau Diastolik >= 120 mmHg',
        description: 'Darurat Medis Kritis! Tekanan darah sangat tinggi dan berisiko merusak organ vital (otak, jantung, ginjal) jika tidak ditangani segera.',
        recommendation: 'SEGERA ke IGD rumah sakit terdekat atau hubungi ambulans darurat! Jangan tunda pemberian pertolongan medis pertama.'
      };
  }
}
