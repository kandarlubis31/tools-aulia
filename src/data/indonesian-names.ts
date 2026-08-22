/**
 * Indonesian Name Generator — dataset
 * 11 kelompok etnis, masing-masing dengan nama depan (per gender),
 * marga/klan, gelar khas, dan pola penamaan khas budaya.
 *
 * Referensi konvensi: en.wikipedia.org/wiki/Indonesian_names
 *  - Mayoritas orang Indonesia tidak punya marga (nama tunggal sah sebagai nama lengkap)
 *  - Batak: klan/marga sebagai "nama belakang" (Siregar, Hutapea, ...)
 *  - Bali: urutan lahir Wayan/Made/Nyoman/Ketut + gelar kasta (I Gusti, Dewa, ...)
 *  - Melayu: patronimik bin/binti + urutan lahir (Sulung/Ongah/Bungsu)
 *  - Minang: gelar Sutan/Datuk (matrilineal)
 *  - Tionghoa-Indonesia: marga di DEPAN (Liem, Tan, Wijaya, ...)
 */

export interface EthnicGroup {
  id: string;
  /** Nama etnis (ID) */
  name: string;
  nameEn: string;
  emoji: string;
  /** Nama depan laki-laki */
  male: string[];
  /** Nama depan perempuan */
  female: string[];
  /** Marga / klan / nama belakang (opsional per etnis) */
  surnames?: string[];
  /** Gelar khas di depan nama (Sutan, Datuk, I Gusti, ...) */
  titles?: { male: string[]; female?: string[] };
  /** Patronimik bin/binti (Melayu, Arab) — pakai nama ayah acak */
  patronymic?: boolean;
  /** Urutan lahir (Bali: Wayan/Made/Nyoman/Ketut; Melayu: Sulung/Ongah/Bungsu) */
  birthOrder?: string[];
  /** Catatan singkat pola penamaan (ID) */
  note: string;
}

export const ethnicGroups: EthnicGroup[] = [
  {
    id: 'jawa',
    name: 'Jawa',
    nameEn: 'Javanese',
    emoji: '🌾',
    note: 'Sering tanpa marga; nama laki-laki banyak berakhiran -o, perempuan -wati/-sari.',
    male: ['Joko', 'Bambang', 'Slamet', 'Suprapto', 'Agus', 'Budi', 'Eko', 'Dedi', 'Heru', 'Wahyu', 'Sigit', 'Bagus', 'Adi', 'Tri', 'Nur', 'Rizky', 'Yoga', 'Dimas', 'Rangga', 'Arif', 'Bayu', 'Fajar', 'Reza', 'Galih', 'Cahyo', 'Yudi', 'Endra', 'Satrio', 'Pramudya', 'Wibowo', 'Danang', 'Gunawan', 'Hendra', 'Kurnia', 'Suryo'],
    female: ['Sari', 'Dewi', 'Ratna', 'Sri', 'Wulan', 'Lestari', 'Indah', 'Rina', 'Yanti', 'Siti', 'Ayu', 'Fitri', 'Ningsih', 'Puspita', 'Kartika', 'Rahayu', 'Widya', 'Sekar', 'Mulyani', 'Larasati', 'Purnama', 'Kusuma', 'Retno', 'Tri', 'Utami', 'Wati', 'Endah', 'Candra', 'Dyah', 'Nurul'],
    surnames: ['Pratama', 'Saputra', 'Santoso', 'Wibowo', 'Kusuma', 'Nugroho', 'Setiawan', 'Purnomo', 'Utomo', 'Wijaya', 'Handoko', 'Pamungkas', 'Susanto', 'Widodo', 'Raharjo', 'Suharto', 'Nusantara', 'Gunarto']  },
  {
    id: 'sunda',
    name: 'Sunda',
    nameEn: 'Sundanese',
    emoji: '⛰️',
    note: 'Tanpa marga; nama khas seperti Asep, Dadang, Ujang; perempuan banyak berawalan En- / berakhiran -i.',
    male: ['Asep', 'Dadang', 'Cecep', 'Iwan', 'Ujang', 'Encang', 'Tedi', 'Rudi', 'Dede', 'Usep', 'Endang', 'Jajang', 'Wawan', 'Aep', 'Taufik', 'Ade', 'Dani', 'Yayan', 'Eman', 'Otang', 'Suryana', 'Karta', 'Maman', 'Ucok', 'Deden', 'Agus', 'Rizky', 'Ginanjar', 'Rahmat', 'Hendar'],
    female: ['Yanti', 'Imas', 'Ai', 'Eneng', 'Neng', 'Yuli', 'Euis', 'Iis', 'Lilis', 'Tini', 'Nani', 'Cucu', 'Ade', 'Sari', 'Dewi', 'Ratih', 'Sri', 'Erna', 'Yani', 'Nurhayati', 'Tati', 'Mimin', 'Oom', 'Juju', 'Komalasari', 'Puspitasari', 'Wulandari', 'Sintia', 'Rina', 'Melati'],
    surnames: ['Ginanjar', 'Suryana', 'Kartasasmita', 'Wirahadikusumah', 'Sastrawijaya', 'Natawijaya', 'Sutisna', 'Permana', 'Hidayat', 'Nugraha']  },
  {
    id: 'batak',
    name: 'Batak',
    nameEn: 'Batak',
    emoji: '🏔️',
    note: 'Pakai marga (klan) sebagai nama belakang: Siregar, Hutapea, Simanjuntak, ...',
    male: ['Togar', 'Mangapul', 'Binsar', 'Dompak', 'Sahat', 'Marolop', 'Poltak', 'Roy', 'Ricardo', 'Andar', 'Jannes', 'Thomson', 'Robert', 'Rudi', 'Jhon', 'Elvis', 'Panusunan', 'Saut', 'Tumpal', 'Sabam', 'Bonar', 'Raja', 'Frans', 'Agus', 'Doli', 'Herman', 'Posman', 'Ramses'],
    female: ['Dame', 'Rotua', 'Lasma', 'Rusmina', 'Tiur', 'Hotma', 'Sondang', 'Mariana', 'Rosmery', 'Elida', 'Renta', 'Lisbet', 'Sarma', 'Bunga', 'Nurhayati', 'Kristina', 'Ria', 'Masni', 'Tiodora', 'Sinta', 'Martha', 'Dewi', 'Sumiati', 'Hotna', 'Nova', 'Lame', 'Ruth', 'Elisabeth', 'Gloria'],
    surnames: ['Siregar', 'Hutapea', 'Simanjuntak', 'Sitompul', 'Rajagukguk', 'Nababan', 'Sihombing', 'Siahaan', 'Purba', 'Manurung', 'Silalahi', 'Panjaitan', 'Simatupang', 'Tampubolon', 'Marpaung', 'Pardede', 'Siagian', 'Simbolon', 'Lumbantoruan', 'Hutabarat', 'Sinaga', 'Nainggolan', 'Saragih', 'Ginting', 'Sembiring', 'Tarigan', 'Tanjung', 'Hutasoit']  },
  {
    id: 'minang',
    name: 'Minangkabau',
    nameEn: 'Minangkabau',
    emoji: '🏠',
    note: 'Matrilineal; gelar adat Sutan/Datuk (laki-laki) sering dipakai di depan nama.',
    male: ['Fauzi', 'Rizal', 'Andi', 'Yuda', 'Ilham', 'Fajar', 'Rizki', 'Hendra', 'Zulkifli', 'Afdal', 'Syafri', 'Edi', 'Dedi', 'Amir', 'Irfan', 'Zul', 'Fadli', 'Rahmad', 'Donny', 'Eka', 'Rian', 'Arief', 'Yogi', 'Iqbal', 'Fikri', 'Rendy', 'Aldi', 'Dodi', 'Yusuf', 'Rangga'],
    female: ['Siti', 'Puti', 'Yulia', 'Desi', 'Rini', 'Fitri', 'Susi', 'Mega', 'Ratna', 'Evi', 'Winda', 'Nila', 'Silvia', 'Yeni', 'Lusi', 'Dina', 'Rani', 'Maya', 'Sari', 'Nadya', 'Intan', 'Putri', 'Vina', 'Laila', 'Sinta', 'Dewi', 'Rina', 'Mela', 'Uci', 'Ayu'],
    titles: { male: ['Sutan', 'Datuk', 'Bagindo', 'Marah', 'Rajo'], female: ['Puti', 'Siti'] }  },
  {
    id: 'betawi',
    name: 'Betawi',
    nameEn: 'Betawi',
    emoji: '🏙️',
    note: 'Khas Jakarta; nama laki-laki seperti Ujang, Encang; pengaruh Arab-Melayu kuat.',
    male: ['Ujang', 'Encang', 'Asmawi', 'Dullah', 'Samsudin', 'Junaedi', 'Mahmud', 'Salim', 'Otong', 'Cecep', 'Bambang', 'Ucok', 'Nurdin', 'Syafei', 'Rohim', 'Jailani', 'Sabeni', 'Marzuki', 'Soleh', 'Ahmad', 'Muhammad', 'Firman', 'Ridwan', 'Topik', 'Darmawan', 'Bustomi', 'Saeful', 'Andre', 'Beny', 'Johan'],
    female: ['Neng', 'Mpok', 'Maimunah', 'Siti', 'Fatimah', 'Maryam', 'Junainah', 'Aminah', 'Sariah', 'Rohaya', 'Atun', 'Emah', 'Sopiah', 'Nurjanah', 'Kalsum', 'Aisyah', 'Rasidah', 'Halimah', 'Darsih', 'Juju', 'Yayah', 'Nani', 'Sari', 'Rahmah', 'Zubaidah', 'Salbiah', 'Nurhayati', 'Ijah', 'Ema', 'Wati']  },
  {
    id: 'bali',
    name: 'Bali',
    nameEn: 'Balinese',
    emoji: '🌺',
    note: 'Urutan lahir: Wayan (pertama), Made (kedua), Nyoman (ketiga), Ketut (keempat). Awalan I (laki) / Ni (perempuan).',
    male: ['Putu', 'Gede', 'Komang', 'Kadek', 'Wayan', 'Nyoman', 'Ketut', 'Dewa', 'Gusti', 'Agung', 'Ari', 'Bagus', 'Dharma', 'Surya', 'Wijaya', 'Budi', 'Wira', 'Arta', 'Widya', 'Candra', 'Sasmita', 'Yudha', 'Eka', 'Dwi', 'Guna', 'Jaya', 'Merta', 'Nanda', 'Raka', 'Suta'],
    female: ['Ayu', 'Ratih', 'Dewi', 'Sri', 'Laksmi', 'Candra', 'Sintya', 'Indah', 'Putri', 'Wulan', 'Gita', 'Saraswati', 'Widhi', 'Paramita', 'Cempaka', 'Melati', 'Sari', 'Maya', 'Diah', 'Ratna', 'Kartika', 'Yuni', 'Dina', 'Sinta', 'Puspita', 'Laras', 'Niluh', 'Made', 'Desi'],
    birthOrder: ['Wayan', 'Made', 'Nyoman', 'Ketut'],
    titles: { male: ['I Gusti', 'Dewa', 'Cokorda', 'Anak Agung', 'Tjokorda'], female: ['Ni Gusti', 'Dewa Ayu', 'Cokorda Istri'] }  },
  {
    id: 'melayu',
    name: 'Melayu',
    nameEn: 'Malay',
    emoji: '⛵',
    note: 'Patronimik bin (laki) / binti (perempuan) + nama ayah; di Medan ada urutan lahir Sulung/Ongah/Bungsu.',
    male: ['Muhammad', 'Ahmad', 'Zulkifli', 'Ismail', 'Syafiq', 'Firdaus', 'Aziz', 'Hakim', 'Rahman', 'Yusuf', 'Idris', 'Kamaruddin', 'Syamsul', 'Jamal', 'Saiful', 'Badrul', 'Imran', 'Hairul', 'Zainal', 'Razak', 'Amran', 'Marzuki', 'Hamzah', 'Nazri', 'Fauzan', 'Hafiz', 'Irwan', 'Roslan', 'Azhari', 'Mukhlas'],
    female: ['Siti', 'Fatimah', 'Aisyah', 'Nur', 'Zainab', 'Mariam', 'Khadijah', 'Rahmah', 'Halimah', 'Salmah', 'Azizah', 'Husna', 'Farah', 'Suhaila', 'Rohani', 'Maimunah', 'Jamilah', 'Hasnah', 'Latifah', 'Zaleha', 'Norliza', 'Aminah', 'Rosmawati', 'Suryani', 'Dahlia', 'Melati', 'Kartini', 'Sofiah', 'Nafisah'],
    surnames: ['Abdullah', 'Rahman', 'Ismail', 'Hashim', 'Zain', 'Ahmad', 'Yusof', 'Hamid', 'Omar', 'Saleh'],
    patronymic: true,
    birthOrder: ['Sulung', 'Ongah', 'Bungsu']  },
  {
    id: 'tionghoa',
    name: 'Tionghoa-Indonesia',
    nameEn: 'Chinese-Indonesian',
    emoji: '🏮',
    note: 'Marga di DEPAN nama (Liem, Tan, Wijaya, Halim, ...) — beda dari kebanyakan etnis lain.',
    male: ['Hendra', 'Andi', 'Steven', 'Kevin', 'Ricky', 'Denny', 'Wilson', 'Hansen', 'Felix', 'Jonathan', 'Samuel', 'Marco', 'Vincent', 'William', 'Nicholas', 'Timothy', 'Albert', 'Bryan', 'Christian', 'Daniel', 'Erick', 'Gregory', 'Ivan', 'Jason', 'Kelvin', 'Leon', 'Michael', 'Nathaniel', 'Oscar'],
    female: ['Cindy', 'Jessica', 'Michelle', 'Tiffany', 'Vanessa', 'Angel', 'Grace', 'Felicia', 'Stephanie', 'Claudia', 'Ivana', 'Evelyn', 'Sherly', 'Jennifer', 'Catherine', 'Agnes', 'Bella', 'Christine', 'Diana', 'Esther', 'Florence', 'Gabriella', 'Helen', 'Isabella', 'Joanne', 'Kathleen', 'Laura', 'Melissa', 'Natalia', 'Olivia'],
    surnames: ['Liem', 'Tan', 'Wijaya', 'Hartono', 'Gunawan', 'Halim', 'Salim', 'Santoso', 'Susanto', 'Kurniawan', 'Hidayat', 'Setiawan', 'Budiman', 'Kusuma', 'Tjandra', 'Winata', 'Ong', 'Tio', 'Sutanto', 'Handoko', 'Surya', 'Cahyadi', 'Prawira', 'Saputra']  },
  {
    id: 'arab',
    name: 'Arab-Indonesia',
    nameEn: 'Arab-Indonesian',
    emoji: '🕌',
    note: 'Awalan Muhammad/Abdul dan akhiran -uddin/-ullah umum; patronimik bin/binti juga dipakai.',
    male: ['Muhammad', 'Abdullah', 'Abdurrahman', 'Abdul', 'Ahmad', 'Mustofa', 'Umar', 'Ali', 'Hasan', 'Husain', 'Ibrahim', 'Yusuf', 'Ismail', 'Syafii', 'Rasyid', 'Faqih', 'Hasyim', 'Mahfud', 'Nuruddin', 'Syamsuddin', 'Habibullah', 'Saiful', 'Badrul', 'Fathul', 'Jamal', 'Imran', 'Arifin', 'Zainuddin', 'Miftah', 'Ridwan'],
    female: ['Aisyah', 'Fatimah', 'Khadijah', 'Maryam', 'Aminah', 'Zainab', 'Sarah', 'Nafisah', 'Husna', 'Laila', 'Hana', 'Aulia', 'Nabila', 'Rahma', 'Salma', 'Alya', 'Zalfa', 'Hafizah', 'Kamilah', 'Nadia', 'Syifa', 'Ummi', 'Azizah', 'Bilqis', 'Farida', 'Hamidah', 'Latifah', 'Masyitah', 'Raudah', 'Salsabila'],
    surnames: ['Al-Habsyi', 'Al-Attas', 'Al-Kaff', 'Assegaf', 'Alatas', 'Bafadal', 'Baharun', 'Al-Jufri', 'Bin Syech', 'Al-Hamid'],
    patronymic: true  },
  {
    id: 'ambon',
    name: 'Ambon/Manado',
    nameEn: 'Ambon/Manado',
    emoji: '🌊',
    note: 'Nama Kristen (Steven, Grace) + marga khas Timur: Sahertian, Latumahina, Wagey, ...',
    male: ['Steven', 'Jeffrey', 'Jefry', 'Ricky', 'Ronald', 'Christo', 'Michael', 'Yosua', 'David', 'Daniel', 'Andre', 'Gerald', 'Richard', 'Fabian', 'Marvin', 'Robby', 'Samuel', 'Timothy', 'Kelvin', 'Vano', 'Reggy', 'Frangky', 'Jhon', 'Rio', 'Stenly', 'Glenn', 'Rey', 'Axel', 'Bryan', 'Cliff'],
    female: ['Meiske', 'Grace', 'Susan', 'Nita', 'Priska', 'Fenny', 'Ivone', 'Merry', 'Yuliana', 'Debora', 'Kristin', 'Glory', 'Agnes', 'Sharon', 'Regina', 'Sisca', 'Mega', 'Cindy', 'Lidya', 'Novi', 'Rachel', 'Silvia', 'Tania', 'Valencia', 'Winda', 'Yessy', 'Angel', 'Cherry', 'Dinda', 'Friska'],
    surnames: ['Sahertian', 'Lopulalan', 'Wagey', 'Patty', 'Latumahina', 'Pelupessy', 'Wattimena', 'Tetelepta', 'Leatemia', 'Nanlohy', 'Mailuhu', 'Matulessy', 'Siwabessy', 'Mandagi', 'Kawilarang', 'Rumbewas', 'Soplanit', 'Sahulata', 'Tuasikal', 'Latuconsina']  },
  {
    id: 'papua',
    name: 'Papua',
    nameEn: 'Papuan',
    emoji: '🦅',
    note: 'Nama Kristen (Yohanes, Marthen, Filep) + marga lokal khas pegunungan: Wenda, Kogoya, Tabuni, ...',
    male: ['Yohanes', 'Marthen', 'Filep', 'Ones', 'Obed', 'Yance', 'Elia', 'Kornelis', 'Melkias', 'Zakarias', 'Petrus', 'Yakobus', 'Isak', 'Daniel', 'Titus', 'Lukas', 'Markus', 'Barnabas', 'Silas', 'Timotius', 'Yulius', 'Natan', 'Amsal', 'Efraim', 'Gideon', 'Habakuk', 'Yeremia', 'Yosua', 'Ruben', 'Salomo'],
    female: ['Maria', 'Yuliana', 'Delila', 'Ribka', 'Hana', 'Debora', 'Ester', 'Ruth', 'Sarah', 'Miriam', 'Lidya', 'Priska', 'Tabita', 'Yunike', 'Sinta', 'Marice', 'Oktovina', 'Sesilia', 'Veronika', 'Magdalena', 'Agustina', 'Melani', 'Selvi', 'Kristina', 'Dorkas', 'Elisabet', 'Gracia', 'Irianti', 'Monika', 'Natalia'],
    surnames: ['Wenda', 'Kogoya', 'Tabuni', 'Yoku', 'Murib', 'Ubra', 'Gobay', 'Magal', 'Kaiway', 'Wanimbo', 'Wonda', 'Sani', 'Puy', 'Pigai', 'Waker', 'Yikwa', 'Walilo', 'Deba', 'Kossay', 'Kembaren']  },
];

/** Nama-nama populer dari berbagai etnis (untuk mode "Campuran") */
export const mixedNames = {
  male: ['Budi', 'Andi', 'Agus', 'Joko', 'Rizky', 'Fajar', 'Yoga', 'Dimas', 'Reza', 'Eko', 'Hendra', 'Bayu', 'Arif', 'Teguh', 'Ivan', 'Fikri', 'Rangga', 'Doni', 'Gilang', 'Adit', 'Raka', 'Naufal', 'Rafi', 'Bima', 'Farhan', 'Ilham', 'Rizal', 'Zaki', 'Aldi', 'Rian'],
  female: ['Sari', 'Dewi', 'Ratna', 'Putri', 'Ayu', 'Indah', 'Rina', 'Lestari', 'Wulan', 'Maya', 'Fitri', 'Nadia', 'Sinta', 'Laras', 'Citra', 'Rani', 'Dian', 'Yuni', 'Nisa', 'Anisa', 'Alya', 'Salsa', 'Keyla', 'Zahra', 'Alika', 'Nayla', 'Syifa', 'Aulia', 'Keisha', 'Gisela'],
};

/** Nama ayah acak untuk patronimik bin/binti */
export const fatherNames = ['Ahmad', 'Abdullah', 'Rahman', 'Ismail', 'Yusuf', 'Ibrahim', 'Hamid', 'Zain', 'Salim', 'Umar', 'Ali', 'Hasan', 'Bakar', 'Mahmud', 'Hasyim', 'Mustafa', 'Rasyid', 'Jamil', 'Saad', 'Khalid'];
