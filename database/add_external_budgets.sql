
-- Tabla para devis externos importados
CREATE TABLE IF NOT EXISTS external_budgets (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  
  -- Información del cliente
  client_name TEXT NOT NULL,
  client_email TEXT NOT NULL,
  client_phone TEXT NOT NULL,
  
  -- Detalles del evento
  event_date DATE,
  event_type TEXT,
  event_address TEXT,
  guest_count TEXT,
  meal_type TEXT,
  
  -- Estado y gestión  
  status TEXT DEFAULT 'pending',
  sent_at TIMESTAMP WITH TIME ZONE,
  last_sent_at TIMESTAMP WITH TIME ZONE,
  
  -- Datos adicionales
  notes TEXT,
  admin_comments TEXT,
  categoria TEXT,
  
  -- Metadata de importación
  imported_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  original_timestamp TIMESTAMP WITH TIME ZONE,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_external_budgets_email ON external_budgets(client_email);
CREATE INDEX IF NOT EXISTS idx_external_budgets_date ON external_budgets(event_date);
CREATE INDEX IF NOT EXISTS idx_external_budgets_status ON external_budgets(status);
CREATE INDEX IF NOT EXISTS idx_external_budgets_name ON external_budgets(client_name);

-- RLS Policies
ALTER TABLE external_budgets ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Enable read access for authenticated users" ON external_budgets;
CREATE POLICY "Enable read access for authenticated users" ON external_budgets
  FOR SELECT
  TO authenticated
  USING (true);

DROP POLICY IF EXISTS "Enable insert for authenticated users" ON external_budgets;
CREATE POLICY "Enable insert for authenticated users" ON external_budgets
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

DROP POLICY IF EXISTS "Enable update for authenticated users" ON external_budgets;
CREATE POLICY "Enable update for authenticated users" ON external_budgets
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

DROP POLICY IF EXISTS "Enable delete for authenticated users" ON external_budgets;
CREATE POLICY "Enable delete for authenticated users" ON external_budgets
  FOR DELETE
  TO authenticated
  USING (true);


-- Insert data
INSERT INTO external_budgets (
    client_name, client_email, client_phone,
    event_date, event_type, event_address, guest_count, meal_type,
    status, categoria, admin_comments, original_timestamp
  ) VALUES (
    'Mickael',
    'mickael@lamareterrassement.com',
    '0650499830',
    '2024-08-09',
    'Autre',
    '27 chemin san peyre Opio',
    '20',
    'null',
    'sent',
    'Particular',
    'null',
    '16/07/2024 15:07:52'::timestamp
  );
INSERT INTO external_budgets (
    client_name, client_email, client_phone,
    event_date, event_type, event_address, guest_count, meal_type,
    status, categoria, admin_comments, original_timestamp
  ) VALUES (
    'romain',
    'pedreno.romain@gmail.com',
    '0650816151',
    '0024-08-02',
    'Anniversaire',
    '313 chemin de la tour carrée 06700 Nice ',
    '20',
    'null',
    'accepted',
    'Particular',
    'null',
    '17/07/2024 18:31:19'::timestamp
  );
INSERT INTO external_budgets (
    client_name, client_email, client_phone,
    event_date, event_type, event_address, guest_count, meal_type,
    status, categoria, admin_comments, original_timestamp
  ) VALUES (
    'Sophie',
    'sophietrehardy@gmail.com',
    '0642780785',
    '2024-08-31',
    'Autre',
    '76 avenue des baumettes Nice',
    '36',
    'null',
    'rejected',
    'Particular',
    'null',
    '17/07/2024 18:38:33'::timestamp
  );
INSERT INTO external_budgets (
    client_name, client_email, client_phone,
    event_date, event_type, event_address, guest_count, meal_type,
    status, categoria, admin_comments, original_timestamp
  ) VALUES (
    'Blua Francois',
    'tradeflat@gmail.com',
    '0681141025',
    '2024-08-09',
    'Autre',
    '406 boulevard emmanuel maurel 06140 Vence',
    '16',
    'null',
    'sent',
    'Particular',
    'null',
    '18/07/2024 11:14:00'::timestamp
  );
INSERT INTO external_budgets (
    client_name, client_email, client_phone,
    event_date, event_type, event_address, guest_count, meal_type,
    status, categoria, admin_comments, original_timestamp
  ) VALUES (
    'Boury Dorian ',
    'dboury@gmail.com',
    '0764359545',
    '2024-09-19',
    'Corporatif',
    '5 rue Léon Maurane Mérignac',
    '80',
    'null',
    'pending',
    'Particular',
    'null',
    '19/07/2024 11:25:29'::timestamp
  );
INSERT INTO external_budgets (
    client_name, client_email, client_phone,
    event_date, event_type, event_address, guest_count, meal_type,
    status, categoria, admin_comments, original_timestamp
  ) VALUES (
    'Massei Kimberley',
    'kimberleymassei@outlook.com',
    '0649355449',
    '0025-07-05',
    'Mariage',
    'Saint vallier de thiey',
    '60',
    'null',
    'rejected',
    'Particular',
    'mail enviado/ Relance el mail',
    '20/07/2024 8:53:39'::timestamp
  );
INSERT INTO external_budgets (
    client_name, client_email, client_phone,
    event_date, event_type, event_address, guest_count, meal_type,
    status, categoria, admin_comments, original_timestamp
  ) VALUES (
    'Coline Strauch',
    'colinest@gmail.com',
    '0674596166',
    '2025-06-07',
    'Mariage',
    'Le Rouret',
    '100',
    'null',
    'rejected',
    'Particular',
    'null',
    '20/07/2024 10:03:11'::timestamp
  );
INSERT INTO external_budgets (
    client_name, client_email, client_phone,
    event_date, event_type, event_address, guest_count, meal_type,
    status, categoria, admin_comments, original_timestamp
  ) VALUES (
    'Verrando sandrine ',
    'sandrine.verrando@hotmail.fr',
    '0627212022',
    '2024-11-02',
    'Anniversaire',
    'Nice ',
    '40',
    'null',
    'pending',
    'Particular',
    'null',
    '20/07/2024 12:01:53'::timestamp
  );
INSERT INTO external_budgets (
    client_name, client_email, client_phone,
    event_date, event_type, event_address, guest_count, meal_type,
    status, categoria, admin_comments, original_timestamp
  ) VALUES (
    'Gwendoline Karolewski ',
    'gwendoline.karolewski@gmail.com',
    '0671082235',
    '2024-09-28',
    'Baptême',
    'Jouques ',
    '45-50',
    'null',
    'pending',
    'Particular',
    'null',
    '20/07/2024 12:35:05'::timestamp
  );
INSERT INTO external_budgets (
    client_name, client_email, client_phone,
    event_date, event_type, event_address, guest_count, meal_type,
    status, categoria, admin_comments, original_timestamp
  ) VALUES (
    'Coupery Eric ',
    'coupery.eric@hotmail.fr',
    '0608934706',
    '2024-08-04',
    'Autre',
    '387 rue des combattants d’Afrique du Nord 83600 Fréjus ',
    'Entre 25 et 30 personnes ',
    'null',
    'pending',
    'Particular',
    'null',
    '21/07/2024 0:17:18'::timestamp
  );
INSERT INTO external_budgets (
    client_name, client_email, client_phone,
    event_date, event_type, event_address, guest_count, meal_type,
    status, categoria, admin_comments, original_timestamp
  ) VALUES (
    'PINTA Veronique',
    'vpshop75@gmail.com',
    '0601491590',
    '2024-09-21',
    'Anniversaire',
    '18 allee des pruniers 06800 cagnes sur mer',
    '50',
    'null',
    'pending',
    'Particular',
    'null',
    '21/07/2024 16:41:00'::timestamp
  );
INSERT INTO external_budgets (
    client_name, client_email, client_phone,
    event_date, event_type, event_address, guest_count, meal_type,
    status, categoria, admin_comments, original_timestamp
  ) VALUES (
    'romain pedreno',
    'pedreno.romain@gmail.com',
    '650816151',
    '2024-08-02',
    'Anniversaire',
    '313 chemin de la tour carrée 06700 St Laurent du var',
    '20',
    'null',
    'pending',
    'Particular',
    'null',
    '22/07/2024 13:22:50'::timestamp
  );
INSERT INTO external_budgets (
    client_name, client_email, client_phone,
    event_date, event_type, event_address, guest_count, meal_type,
    status, categoria, admin_comments, original_timestamp
  ) VALUES (
    'Catherine Joao',
    'cat.j.06@gmail.com',
    '0666615418',
    '2024-10-05',
    'Anniversaire',
    'Mouans sartoux',
    '50',
    'null',
    'pending',
    'Particular',
    'null',
    '22/07/2024 16:10:53'::timestamp
  );
INSERT INTO external_budgets (
    client_name, client_email, client_phone,
    event_date, event_type, event_address, guest_count, meal_type,
    status, categoria, admin_comments, original_timestamp
  ) VALUES (
    'Claire',
    'mollaretclaire@gmail.com',
    '0661293116',
    '2024-09-28',
    'Anniversaire',
    'Grasse',
    '30',
    'null',
    'pending',
    'Particular',
    'null',
    '23/07/2024 20:41:44'::timestamp
  );
INSERT INTO external_budgets (
    client_name, client_email, client_phone,
    event_date, event_type, event_address, guest_count, meal_type,
    status, categoria, admin_comments, original_timestamp
  ) VALUES (
    'EMILIE BOURDETTE DONON ',
    'emilielelievre06@gmail.com',
    '0622879021',
    '2024-09-21',
    'Baptême',
    '463 chemin des pignatons, roquefort les pins',
    '40',
    'null',
    'pending',
    'Particular',
    'null',
    '24/07/2024 8:54:41'::timestamp
  );
INSERT INTO external_budgets (
    client_name, client_email, client_phone,
    event_date, event_type, event_address, guest_count, meal_type,
    status, categoria, admin_comments, original_timestamp
  ) VALUES (
    'Guerineau Yasmine',
    'yasmine@magic-octopus.com',
    '0624888171',
    '2024-09-24',
    'Autre',
    '6 avenue des fleurs',
    '250',
    'null',
    'pending',
    'Empresa',
    'null',
    '25/07/2024 12:22:27'::timestamp
  );
INSERT INTO external_budgets (
    client_name, client_email, client_phone,
    event_date, event_type, event_address, guest_count, meal_type,
    status, categoria, admin_comments, original_timestamp
  ) VALUES (
    'Jennifer Plisson ',
    'jen.plisson@gmail.com',
    '0663578686',
    '2024-09-19',
    'Mariage',
    '155 Chemin Du Bosquet ',
    '25',
    'null',
    'pending',
    'Particular',
    'null',
    '29/07/2024 0:26:49'::timestamp
  );
INSERT INTO external_budgets (
    client_name, client_email, client_phone,
    event_date, event_type, event_address, guest_count, meal_type,
    status, categoria, admin_comments, original_timestamp
  ) VALUES (
    'Eugénie Rovire ',
    'eugeniervr@hotmail.com',
    '0762879822',
    '2024-10-05',
    'Anniversaire',
    '18 Chemin de la Tramontane 06200 nice ',
    '45',
    'null',
    'pending',
    'Particular',
    'null',
    '29/07/2024 12:39:22'::timestamp
  );
INSERT INTO external_budgets (
    client_name, client_email, client_phone,
    event_date, event_type, event_address, guest_count, meal_type,
    status, categoria, admin_comments, original_timestamp
  ) VALUES (
    'Dranes Lisa ',
    'lisa.dranes@gmail.com',
    '680869715',
    '2024-09-29',
    'Anniversaire',
    '80 chemin du claus Gattières ',
    '50',
    'null',
    'pending',
    'Particular',
    'null',
    '29/07/2024 13:59:47'::timestamp
  );
INSERT INTO external_budgets (
    client_name, client_email, client_phone,
    event_date, event_type, event_address, guest_count, meal_type,
    status, categoria, admin_comments, original_timestamp
  ) VALUES (
    'Julie Torfs',
    'julietorfs@icloud.com',
    '+33640625720',
    '2024-08-20',
    'Autre',
    '7 avenue de la Torraca',
    '20',
    'null',
    'pending',
    'Particular',
    'null',
    '30/07/2024 13:58:48'::timestamp
  );
INSERT INTO external_budgets (
    client_name, client_email, client_phone,
    event_date, event_type, event_address, guest_count, meal_type,
    status, categoria, admin_comments, original_timestamp
  ) VALUES (
    'HERTRICH CHRISTINE',
    'christine@hertrich.fr',
    '06 15 62 83 76',
    '2024-08-10',
    'Autre',
    '72 AVENUE DU LAC 83480 PUGET SUR ARGENS',
    '20',
    'null',
    'pending',
    'Particular',
    'null',
    '31/07/2024 12:33:10'::timestamp
  );
INSERT INTO external_budgets (
    client_name, client_email, client_phone,
    event_date, event_type, event_address, guest_count, meal_type,
    status, categoria, admin_comments, original_timestamp
  ) VALUES (
    'HILLAIRET Cécile',
    'cils.hh@gmail.com',
    '0616470432',
    '2024-09-14',
    'Anniversaire',
    '78 chemin des hautes vignasses 06410 BIOT',
    '90',
    'null',
    'pending',
    'Particular',
    'null',
    '2/08/2024 15:45:59'::timestamp
  );
INSERT INTO external_budgets (
    client_name, client_email, client_phone,
    event_date, event_type, event_address, guest_count, meal_type,
    status, categoria, admin_comments, original_timestamp
  ) VALUES (
    'Christian Sandrine ',
    'sandtititel@gmail.com',
    '0622538159',
    '2024-08-10',
    'Anniversaire',
    '8918 route de Cagnes 06610 la Gaude ',
    '20',
    'null',
    'pending',
    'Particular',
    'null',
    '3/08/2024 19:47:54'::timestamp
  );
INSERT INTO external_budgets (
    client_name, client_email, client_phone,
    event_date, event_type, event_address, guest_count, meal_type,
    status, categoria, admin_comments, original_timestamp
  ) VALUES (
    'Pattenden Gregory ',
    'gregorypattenden@outlook.com',
    '0601926517',
    '2025-09-12',
    'Mariage',
    'Toulon',
    '29/04/1900',
    'null',
    'rejected',
    'Particular',
    'No responde',
    '5/08/2024 16:42:24'::timestamp
  );
INSERT INTO external_budgets (
    client_name, client_email, client_phone,
    event_date, event_type, event_address, guest_count, meal_type,
    status, categoria, admin_comments, original_timestamp
  ) VALUES (
    'Gherardi François et Chloé',
    'francois.gherardi@gmail.com',
    '0675023785',
    '2025-08-02',
    'Mariage',
    'Moulin d''Espagne 83 chemin du Moulin 83560 Ginasservis',
    '90',
    'null',
    'rejected',
    'Particular',
    'null',
    '6/08/2024 23:39:36'::timestamp
  );
INSERT INTO external_budgets (
    client_name, client_email, client_phone,
    event_date, event_type, event_address, guest_count, meal_type,
    status, categoria, admin_comments, original_timestamp
  ) VALUES (
    'Tuma Olga',
    'olgatuma@hotmail.com',
    '0658947357',
    '2025-02-15',
    'Mariage',
    'Cannes',
    '35',
    'null',
    'rejected',
    'Particular',
    'null',
    '7/08/2024 11:58:01'::timestamp
  );
INSERT INTO external_budgets (
    client_name, client_email, client_phone,
    event_date, event_type, event_address, guest_count, meal_type,
    status, categoria, admin_comments, original_timestamp
  ) VALUES (
    'Musso Eve-Anna ',
    'ea.musso@comback.fr',
    '663976373',
    '1980-01-11',
    'Corporatif',
    'Nice ',
    '50',
    'null',
    'pending',
    'Empresa',
    'null',
    '8/08/2024 17:45:02'::timestamp
  );
INSERT INTO external_budgets (
    client_name, client_email, client_phone,
    event_date, event_type, event_address, guest_count, meal_type,
    status, categoria, admin_comments, original_timestamp
  ) VALUES (
    'Metzger Silke',
    'metzger.silke@gmail.com',
    '0620413249',
    '2024-10-12',
    'Anniversaire',
    'Golfe juan',
    '60',
    'null',
    'pending',
    'Particular',
    'null',
    '11/08/2024 17:35:45'::timestamp
  );
INSERT INTO external_budgets (
    client_name, client_email, client_phone,
    event_date, event_type, event_address, guest_count, meal_type,
    status, categoria, admin_comments, original_timestamp
  ) VALUES (
    'Germain Maureen ',
    'gaelmaureen06@hotmail.fr',
    '0681060446',
    '2024-09-07',
    'Mariage',
    'Vence',
    '35',
    'null',
    'pending',
    'Particular',
    'null',
    '12/08/2024 14:41:18'::timestamp
  );
INSERT INTO external_budgets (
    client_name, client_email, client_phone,
    event_date, event_type, event_address, guest_count, meal_type,
    status, categoria, admin_comments, original_timestamp
  ) VALUES (
    'Laurent CHETON',
    'laurentcheton@gmail.com',
    '0789258083',
    '2024-08-24',
    'Anniversaire',
    '327 chemin des Brusquets',
    '25',
    'null',
    'pending',
    'Particular',
    'null',
    '12/08/2024 18:15:53'::timestamp
  );
INSERT INTO external_budgets (
    client_name, client_email, client_phone,
    event_date, event_type, event_address, guest_count, meal_type,
    status, categoria, admin_comments, original_timestamp
  ) VALUES (
    'Germain gael ',
    'gaelmaureen06@hotmail.fr',
    '0643037165',
    '2024-09-07',
    'Mariage',
    'Ancien chemin de saint paul',
    '35_40',
    'null',
    'pending',
    'Particular',
    'null',
    '12/08/2024 20:44:58'::timestamp
  );
INSERT INTO external_budgets (
    client_name, client_email, client_phone,
    event_date, event_type, event_address, guest_count, meal_type,
    status, categoria, admin_comments, original_timestamp
  ) VALUES (
    'Gordiano Marion',
    'marion.gordiano7@gmail.com',
    '0688407986',
    '2024-09-14',
    'Autre',
    'Mouans Sartoux',
    '40',
    'null',
    'pending',
    'Particular',
    'null',
    '13/08/2024 11:04:25'::timestamp
  );
INSERT INTO external_budgets (
    client_name, client_email, client_phone,
    event_date, event_type, event_address, guest_count, meal_type,
    status, categoria, admin_comments, original_timestamp
  ) VALUES (
    'Muller Emeric',
    'emeric.muller@gmail.com',
    '0606708728',
    '2024-08-30',
    'Anniversaire',
    '21-63 chemin du loup Mouans Sarthoux 06370',
    '20',
    'null',
    'pending',
    'Particular',
    'null',
    '13/08/2024 16:55:02'::timestamp
  );
INSERT INTO external_budgets (
    client_name, client_email, client_phone,
    event_date, event_type, event_address, guest_count, meal_type,
    status, categoria, admin_comments, original_timestamp
  ) VALUES (
    'Ferri Laura',
    'lauraferri@showroomby.com',
    '0635278442',
    '2024-09-29',
    'Autre',
    'Résidence Edenroc 441 avenue edith Joseph 06 Vallauris',
    '80',
    'null',
    'pending',
    'Empresa',
    'null',
    '14/08/2024 21:06:40'::timestamp
  );
INSERT INTO external_budgets (
    client_name, client_email, client_phone,
    event_date, event_type, event_address, guest_count, meal_type,
    status, categoria, admin_comments, original_timestamp
  ) VALUES (
    'Lopez caroll',
    'carolllopez@sfr.fr',
    '0609965030',
    '2024-09-07',
    'Anniversaire',
    'St laurent du var',
    '27',
    'null',
    'pending',
    'Particular',
    'null',
    '19/08/2024 11:13:21'::timestamp
  );
INSERT INTO external_budgets (
    client_name, client_email, client_phone,
    event_date, event_type, event_address, guest_count, meal_type,
    status, categoria, admin_comments, original_timestamp
  ) VALUES (
    'Blaise Pauline',
    'paulinedemaistre@gmail.com',
    '0626538342',
    '2024-09-22',
    'Mariage',
    'Prieure notre dame de conil - chemin de tournefort 13840 Rognes',
    '100',
    'null',
    'pending',
    'Particular',
    'null',
    '20/08/2024 12:09:59'::timestamp
  );
INSERT INTO external_budgets (
    client_name, client_email, client_phone,
    event_date, event_type, event_address, guest_count, meal_type,
    status, categoria, admin_comments, original_timestamp
  ) VALUES (
    'NABIL Marianne',
    'marianne.nabil@isadev.com',
    '0635020271',
    '2024-09-06',
    'Corporatif',
    '105 route de Canta Galet 06200 Nice',
    '35',
    'null',
    'pending',
    'Empresa',
    'null',
    '20/08/2024 12:31:32'::timestamp
  );
INSERT INTO external_budgets (
    client_name, client_email, client_phone,
    event_date, event_type, event_address, guest_count, meal_type,
    status, categoria, admin_comments, original_timestamp
  ) VALUES (
    'Jean-Christophe Jouve',
    'jcj1608@yahoo.com',
    '0631910717',
    '2024-09-08',
    'Anniversaire',
    'Biot',
    '16',
    'null',
    'pending',
    'Particular',
    'null',
    '20/08/2024 21:56:55'::timestamp
  );
INSERT INTO external_budgets (
    client_name, client_email, client_phone,
    event_date, event_type, event_address, guest_count, meal_type,
    status, categoria, admin_comments, original_timestamp
  ) VALUES (
    'Panaras Héloïse',
    'hlopanaras2010@live.fr',
    '0646875443',
    '2024-10-04',
    'Autre',
    'Mougins',
    '40',
    'null',
    'pending',
    'Particular',
    'null',
    '21/08/2024 8:56:10'::timestamp
  );
INSERT INTO external_budgets (
    client_name, client_email, client_phone,
    event_date, event_type, event_address, guest_count, meal_type,
    status, categoria, admin_comments, original_timestamp
  ) VALUES (
    'alison giner',
    'alison.giner@gmail.com',
    '0618331532',
    '2025-04-20',
    'Anniversaire',
    '82 rue de paris',
    '60/70',
    'null',
    'rejected',
    'Particular',
    'mail enviado/ Relance el mail',
    '21/08/2024 12:30:03'::timestamp
  );
INSERT INTO external_budgets (
    client_name, client_email, client_phone,
    event_date, event_type, event_address, guest_count, meal_type,
    status, categoria, admin_comments, original_timestamp
  ) VALUES (
    'Monier aurelie',
    'amonier@architecture.com.fr',
    '0618409961',
    '2024-09-13',
    'Autre',
    'Biot',
    '100',
    'null',
    'pending',
    'Empresa',
    'null',
    '23/08/2024 8:07:32'::timestamp
  );
INSERT INTO external_budgets (
    client_name, client_email, client_phone,
    event_date, event_type, event_address, guest_count, meal_type,
    status, categoria, admin_comments, original_timestamp
  ) VALUES (
    'Thérouse Annie',
    'annie.therouse@gmail.com',
    '0615077506',
    '2024-09-27',
    'Autre',
    '33 Ave Wester Wemyss 06150 Cannes',
    '50',
    'null',
    'pending',
    'Particular',
    'null',
    '24/08/2024 10:01:47'::timestamp
  );
INSERT INTO external_budgets (
    client_name, client_email, client_phone,
    event_date, event_type, event_address, guest_count, meal_type,
    status, categoria, admin_comments, original_timestamp
  ) VALUES (
    'Alba Emilie',
    'alba.emilie@hotmail.com',
    '0616105333',
    '2025-07-20',
    'Autre',
    'Domaine Nestuby, Cotignac',
    '50',
    'null',
    'rejected',
    'Particular',
    'No responde',
    '24/08/2024 18:00:14'::timestamp
  );
INSERT INTO external_budgets (
    client_name, client_email, client_phone,
    event_date, event_type, event_address, guest_count, meal_type,
    status, categoria, admin_comments, original_timestamp
  ) VALUES (
    'Sartore  Sébastien ',
    's.sartore@hotmail.fr',
    '0680863520',
    '2024-09-01',
    'Autre',
    '90 Allée de la Source, Ramatuelle, Provence-Alpes-Cote d’Azur, 83350, France',
    '10',
    'null',
    'pending',
    'Particular',
    'null',
    '25/08/2024 15:33:10'::timestamp
  );
INSERT INTO external_budgets (
    client_name, client_email, client_phone,
    event_date, event_type, event_address, guest_count, meal_type,
    status, categoria, admin_comments, original_timestamp
  ) VALUES (
    'Celia Ossetti',
    'c.ossetti@bymycar.fr',
    '0610792958',
    '2024-10-10',
    'Autre',
    '73 allée  la Girane',
    '100',
    'null',
    'pending',
    'Empresa',
    'null',
    '27/08/2024 10:40:03'::timestamp
  );
INSERT INTO external_budgets (
    client_name, client_email, client_phone,
    event_date, event_type, event_address, guest_count, meal_type,
    status, categoria, admin_comments, original_timestamp
  ) VALUES (
    'Katia Vedrine',
    'Vedrinekatia@gmail.com',
    '0768420956',
    '2025-07-25',
    'Mariage',
    '481 chemin du gros chêne',
    '120',
    'null',
    'rejected',
    'Particular',
    'mail enviado/ Relance el mail',
    '27/08/2024 10:42:01'::timestamp
  );
INSERT INTO external_budgets (
    client_name, client_email, client_phone,
    event_date, event_type, event_address, guest_count, meal_type,
    status, categoria, admin_comments, original_timestamp
  ) VALUES (
    'Aimasso Jean-Noel',
    'jnaimasso@gmail.com',
    '0672928423',
    '2024-09-28',
    'Mariage',
    'LA ROQUETTE SUR SIAGNE',
    '90',
    'null',
    'pending',
    'Particular',
    'null',
    '27/08/2024 20:24:34'::timestamp
  );
INSERT INTO external_budgets (
    client_name, client_email, client_phone,
    event_date, event_type, event_address, guest_count, meal_type,
    status, categoria, admin_comments, original_timestamp
  ) VALUES (
    'Bruno Vanessa',
    'vanessa.bruno1@gmail.com',
    '0629586508',
    '2024-09-29',
    'Anniversaire',
    '638 chemin du pioulier VENCE ',
    '30',
    'null',
    'pending',
    'Particular',
    'null',
    '28/08/2024 11:05:03'::timestamp
  );
INSERT INTO external_budgets (
    client_name, client_email, client_phone,
    event_date, event_type, event_address, guest_count, meal_type,
    status, categoria, admin_comments, original_timestamp
  ) VALUES (
    'Blanchard Cédric ',
    'cedricmc98@hotmail.com',
    '06 72 52 08 43 ',
    '2024-09-14',
    'Anniversaire',
    'Chemin du buse Roquebrune Cap Martin ',
    '30',
    'null',
    'pending',
    'Particular',
    'null',
    '29/08/2024 18:47:53'::timestamp
  );
INSERT INTO external_budgets (
    client_name, client_email, client_phone,
    event_date, event_type, event_address, guest_count, meal_type,
    status, categoria, admin_comments, original_timestamp
  ) VALUES (
    'benazzi sylvain',
    'sbenazzi@ciffreobona.fr',
    '0620504737',
    '2024-10-09',
    'Autre',
    '1 avenue des alpes',
    '80/100 personnes',
    'null',
    'pending',
    'Empresa',
    'null',
    '30/08/2024 7:20:09'::timestamp
  );
INSERT INTO external_budgets (
    client_name, client_email, client_phone,
    event_date, event_type, event_address, guest_count, meal_type,
    status, categoria, admin_comments, original_timestamp
  ) VALUES (
    'Fiona Savalli',
    'savallifiona.13@gmail.com',
    '0664696041',
    '2024-10-05',
    'Anniversaire',
    'Contes',
    'Environ 20',
    'null',
    'pending',
    'Particular',
    'null',
    '31/08/2024 13:15:01'::timestamp
  );
INSERT INTO external_budgets (
    client_name, client_email, client_phone,
    event_date, event_type, event_address, guest_count, meal_type,
    status, categoria, admin_comments, original_timestamp
  ) VALUES (
    'Tournois Diane',
    'diane.tournois@vgrf.fr',
    '0610082359',
    '2024-10-17',
    'Autre',
    'Mandelieu',
    '120',
    'null',
    'pending',
    'Empresa',
    'null',
    '3/09/2024 14:44:18'::timestamp
  );
INSERT INTO external_budgets (
    client_name, client_email, client_phone,
    event_date, event_type, event_address, guest_count, meal_type,
    status, categoria, admin_comments, original_timestamp
  ) VALUES (
    'Johey Reske',
    'johey.reske@outlook.fr',
    'X',
    '2025-09-01',
    'Mariage',
    '59000 Lille - France',
    '35',
    'null',
    'rejected',
    'Particular',
    'null',
    '3/09/2024 18:56:53'::timestamp
  );
INSERT INTO external_budgets (
    client_name, client_email, client_phone,
    event_date, event_type, event_address, guest_count, meal_type,
    status, categoria, admin_comments, original_timestamp
  ) VALUES (
    'Fanny Nicosia',
    'fanny.nicosia@gmail.com',
    '0616451165',
    '2024-09-28',
    'Anniversaire',
    '141 CHEMIN DU HAUT COULOUBRIER',
    '25',
    'null',
    'pending',
    'Particular',
    'null',
    '4/09/2024 21:47:50'::timestamp
  );
INSERT INTO external_budgets (
    client_name, client_email, client_phone,
    event_date, event_type, event_address, guest_count, meal_type,
    status, categoria, admin_comments, original_timestamp
  ) VALUES (
    'Reda jamila ',
    'Jami-dahou@hotmail.fr',
    '0621877320',
    '2024-09-27',
    'Autre',
    '4 avenue pauliani 06000 Nice ',
    '50',
    'null',
    'pending',
    'Particular',
    'null',
    '6/09/2024 15:18:27'::timestamp
  );
INSERT INTO external_budgets (
    client_name, client_email, client_phone,
    event_date, event_type, event_address, guest_count, meal_type,
    status, categoria, admin_comments, original_timestamp
  ) VALUES (
    'Bonnon Scheherazade',
    'smoslih@gmail.com',
    '0622722950',
    '2025-06-28',
    'Anniversaire',
    '125 chemin des Peires 83119 Brue-Auriac',
    '35',
    'null',
    'rejected',
    'Particular',
    'null',
    '6/09/2024 18:54:24'::timestamp
  );
INSERT INTO external_budgets (
    client_name, client_email, client_phone,
    event_date, event_type, event_address, guest_count, meal_type,
    status, categoria, admin_comments, original_timestamp
  ) VALUES (
    'Riou Émilie ',
    'riemilie@hotmail.fr',
    '0616466545',
    '2024-10-05',
    'Anniversaire',
    '20 Chemin de la Fontanette',
    '20',
    'null',
    'pending',
    'Particular',
    'null',
    '7/09/2024 15:58:21'::timestamp
  );
INSERT INTO external_budgets (
    client_name, client_email, client_phone,
    event_date, event_type, event_address, guest_count, meal_type,
    status, categoria, admin_comments, original_timestamp
  ) VALUES (
    'Riou Leruste colette ',
    'coletteriou@hotmail.fr',
    '0650385963',
    '2025-10-05',
    'Anniversaire',
    'Chemin de la Fontanette 06410 Biot ',
    '25',
    'null',
    'rejected',
    'Particular',
    'mail enviado/ Relance el mail',
    '9/09/2024 20:19:08'::timestamp
  );
INSERT INTO external_budgets (
    client_name, client_email, client_phone,
    event_date, event_type, event_address, guest_count, meal_type,
    status, categoria, admin_comments, original_timestamp
  ) VALUES (
    'Filipponi Eddy',
    'eddy@mo-consulting.com',
    '0616262199',
    '2025-07-19',
    'Anniversaire',
    'St Vallier de Thiey',
    '50',
    'null',
    'rejected',
    'Empresa',
    'mail enviado/ Relance el mail',
    '12/09/2024 20:34:07'::timestamp
  );
INSERT INTO external_budgets (
    client_name, client_email, client_phone,
    event_date, event_type, event_address, guest_count, meal_type,
    status, categoria, admin_comments, original_timestamp
  ) VALUES (
    'Anne et Éric PRIETO',
    'anne.eric.gignac@gmail.com',
    '0682935614',
    '2025-07-26',
    'Anniversaire',
    '13 bis impasse des amandiers 13740 le rove',
    'Minimum 50',
    'null',
    'rejected',
    'Particular',
    'No responde',
    '13/09/2024 12:59:33'::timestamp
  );
INSERT INTO external_budgets (
    client_name, client_email, client_phone,
    event_date, event_type, event_address, guest_count, meal_type,
    status, categoria, admin_comments, original_timestamp
  ) VALUES (
    'Debergue Céline ',
    'debergueceline@gmail.com',
    '0771133291',
    '2024-11-02',
    'Anniversaire',
    'Rocbaron ',
    '35',
    'null',
    'pending',
    'Particular',
    'null',
    '17/09/2024 13:07:13'::timestamp
  );
INSERT INTO external_budgets (
    client_name, client_email, client_phone,
    event_date, event_type, event_address, guest_count, meal_type,
    status, categoria, admin_comments, original_timestamp
  ) VALUES (
    'Clotilde LA BIONDA ',
    'clotilde.06@live.fr',
    '0613027992',
    '2025-07-12',
    'Mariage',
    'Cagnes sur mer ',
    '50',
    'null',
    'rejected',
    'Particular',
    'ultimo',
    '17/09/2024 14:42:26'::timestamp
  );
INSERT INTO external_budgets (
    client_name, client_email, client_phone,
    event_date, event_type, event_address, guest_count, meal_type,
    status, categoria, admin_comments, original_timestamp
  ) VALUES (
    'Elvina',
    'elvinarossow@gmail.com',
    '0650230575',
    '2025-08-05',
    'Mariage',
    '1958 Corniche Normandie Niemen',
    '60',
    'null',
    'rejected',
    'Particular',
    'null',
    '19/09/2024 20:35:03'::timestamp
  );
INSERT INTO external_budgets (
    client_name, client_email, client_phone,
    event_date, event_type, event_address, guest_count, meal_type,
    status, categoria, admin_comments, original_timestamp
  ) VALUES (
    'Haffner Nicolas',
    'nicolas.hbfs@gmail.com',
    '0669672093',
    '2024-10-12',
    'Anniversaire',
    '1 allée San Pedro 83700 Saint Raphaël',
    '50',
    'null',
    'pending',
    'Particular',
    'null',
    '20/09/2024 9:19:30'::timestamp
  );
INSERT INTO external_budgets (
    client_name, client_email, client_phone,
    event_date, event_type, event_address, guest_count, meal_type,
    status, categoria, admin_comments, original_timestamp
  ) VALUES (
    'Sartori Luca',
    'chamatsxi@gmail.com',
    '0624691910',
    '2024-10-19',
    'Autre',
    'Roquebrune Cap Martin ',
    '10-12',
    'null',
    'pending',
    'Particular',
    'null',
    '22/09/2024 14:23:36'::timestamp
  );
INSERT INTO external_budgets (
    client_name, client_email, client_phone,
    event_date, event_type, event_address, guest_count, meal_type,
    status, categoria, admin_comments, original_timestamp
  ) VALUES (
    'Hennequez Dany',
    'lucasetenola06130@hotmail.fr',
    '0637078263',
    '2025-06-07',
    'Mariage',
    '06800 Cagnes sur mer ',
    '80',
    'null',
    'rejected',
    'Particular',
    'No disponibles',
    '22/09/2024 14:30:50'::timestamp
  );
INSERT INTO external_budgets (
    client_name, client_email, client_phone,
    event_date, event_type, event_address, guest_count, meal_type,
    status, categoria, admin_comments, original_timestamp
  ) VALUES (
    'Marika Massoutier ',
    'massoutiermarika@yahoo.fr',
    '0614335130',
    '2025-06-21',
    'Anniversaire',
    '614 route de Pie Lombard Tourrettes-sur-Loup ',
    '50',
    'null',
    'rejected',
    'Particular',
    'null',
    '24/09/2024 8:38:59'::timestamp
  );
INSERT INTO external_budgets (
    client_name, client_email, client_phone,
    event_date, event_type, event_address, guest_count, meal_type,
    status, categoria, admin_comments, original_timestamp
  ) VALUES (
    'Chauvet Louise',
    'el.firtin@gmail.com',
    '+33680863348',
    '2025-10-11',
    'Mariage',
    'Villa Tomille, Roquebrune Cap Martin',
    '60',
    'null',
    'rejected',
    'Particular',
    'Ulitmo relanzo',
    '24/09/2024 15:01:40'::timestamp
  );
INSERT INTO external_budgets (
    client_name, client_email, client_phone,
    event_date, event_type, event_address, guest_count, meal_type,
    status, categoria, admin_comments, original_timestamp
  ) VALUES (
    'Isoart jessica',
    'tgtiegal@gmail.com',
    '0782660042',
    '2024-10-26',
    'Anniversaire',
    'Blausasc 06',
    '75',
    'null',
    'pending',
    'Particular',
    'null',
    '25/09/2024 19:20:50'::timestamp
  );
INSERT INTO external_budgets (
    client_name, client_email, client_phone,
    event_date, event_type, event_address, guest_count, meal_type,
    status, categoria, admin_comments, original_timestamp
  ) VALUES (
    'Alba patrice',
    'patrice.alba@vinci-construction.fr',
    '0612993305',
    '2024-07-20',
    'Autre',
    'Cotignac dans la var',
    '50',
    'null',
    'pending',
    'Empresa',
    'null',
    '28/09/2024 8:54:17'::timestamp
  );
INSERT INTO external_budgets (
    client_name, client_email, client_phone,
    event_date, event_type, event_address, guest_count, meal_type,
    status, categoria, admin_comments, original_timestamp
  ) VALUES (
    'Doriane Descamps',
    'info@dorianedescamps.com',
    '00447510688471',
    '2026-06-27',
    'Autre',
    'Château de Vaucouleurs Pugets Sur Argens',
    '55',
    'null',
    'rejected',
    'Particular',
    'mail enviado/ Relance el mail',
    '29/09/2024 11:59:55'::timestamp
  );
INSERT INTO external_budgets (
    client_name, client_email, client_phone,
    event_date, event_type, event_address, guest_count, meal_type,
    status, categoria, admin_comments, original_timestamp
  ) VALUES (
    'Fabre Leleu Pauline ',
    'fabre_pauline83@orange.fr',
    '06 02 63 24 01 ',
    '2025-06-22',
    'Autre',
    '3970 route de brignoles 83340 cabasse',
    '40',
    'null',
    'rejected',
    'Particular',
    'null',
    '30/09/2024 12:19:25'::timestamp
  );
INSERT INTO external_budgets (
    client_name, client_email, client_phone,
    event_date, event_type, event_address, guest_count, meal_type,
    status, categoria, admin_comments, original_timestamp
  ) VALUES (
    'Magali',
    'cagnazzo.magali@gmail.com',
    '0671146543',
    '2025-03-09',
    'Anniversaire',
    '52 Bis , Chemin De La Colle Germaine',
    '35',
    'null',
    'accepted',
    'Particular',
    'null',
    '2/10/2024 14:04:40'::timestamp
  );
INSERT INTO external_budgets (
    client_name, client_email, client_phone,
    event_date, event_type, event_address, guest_count, meal_type,
    status, categoria, admin_comments, original_timestamp
  ) VALUES (
    'Fromentin jean marc ',
    'benjamin.kenji@yahoo.fr',
    '0674890304',
    '2025-10-25',
    'Mariage',
    '8 montée du stade villa l''aurore ',
    '40',
    'null',
    'pending',
    'Particular',
    'mail enviado/ Relance el mail',
    '5/10/2024 16:11:47'::timestamp
  );
INSERT INTO external_budgets (
    client_name, client_email, client_phone,
    event_date, event_type, event_address, guest_count, meal_type,
    status, categoria, admin_comments, original_timestamp
  ) VALUES (
    'Yoann BRACCO',
    'yoannbracco83@gmail.com',
    '0786840938',
    '2025-09-13',
    'Mariage',
    'Domaine du Viet - Hyères',
    '90',
    'null',
    'rejected',
    'Particular',
    'null',
    '5/10/2024 18:20:36'::timestamp
  );
INSERT INTO external_budgets (
    client_name, client_email, client_phone,
    event_date, event_type, event_address, guest_count, meal_type,
    status, categoria, admin_comments, original_timestamp
  ) VALUES (
    'Lagorio romain ',
    'romlag06@hotmail.com',
    '0608941178',
    '2025-09-07',
    'Anniversaire',
    'Vence ',
    '70',
    'null',
    'rejected',
    'Particular',
    'null',
    '8/10/2024 7:32:31'::timestamp
  );
INSERT INTO external_budgets (
    client_name, client_email, client_phone,
    event_date, event_type, event_address, guest_count, meal_type,
    status, categoria, admin_comments, original_timestamp
  ) VALUES (
    'PRION ALEXANDRA',
    'alexandra.prion5@gmail.com',
    '0783526434',
    '2025-07-26',
    'Mariage',
    '1984 route de la pénétrante 06380 sospel',
    '60',
    'null',
    'rejected',
    'Particular',
    'null',
    '8/10/2024 20:16:58'::timestamp
  );
INSERT INTO external_budgets (
    client_name, client_email, client_phone,
    event_date, event_type, event_address, guest_count, meal_type,
    status, categoria, admin_comments, original_timestamp
  ) VALUES (
    'Theraud Morgan ',
    'morgan06@hotmail.fr',
    '0688387553',
    '2025-05-10',
    'Anniversaire',
    '9 rue bd Maréchal Joffre 06310 Beaulieu sur mer',
    '50',
    'null',
    'rejected',
    'Particular',
    'null',
    '9/10/2024 18:34:55'::timestamp
  );
INSERT INTO external_budgets (
    client_name, client_email, client_phone,
    event_date, event_type, event_address, guest_count, meal_type,
    status, categoria, admin_comments, original_timestamp
  ) VALUES (
    'Prodé Clément ',
    'girevoy06@gmail.com',
    '0648385810',
    '2025-08-23',
    'Mariage',
    'Saint Vallier',
    '60',
    'null',
    'rejected',
    'Particular',
    'ultimo',
    '11/10/2024 11:10:31'::timestamp
  );
INSERT INTO external_budgets (
    client_name, client_email, client_phone,
    event_date, event_type, event_address, guest_count, meal_type,
    status, categoria, admin_comments, original_timestamp
  ) VALUES (
    'Alba Adrienne',
    'adriennealba99@gmail.com',
    '0679835854',
    '2025-06-28',
    'Mariage',
    '18 Rue Gustave Eiffel 06310',
    '36',
    'null',
    'rejected',
    'Particular',
    'null',
    '13/10/2024 21:22:31'::timestamp
  );
INSERT INTO external_budgets (
    client_name, client_email, client_phone,
    event_date, event_type, event_address, guest_count, meal_type,
    status, categoria, admin_comments, original_timestamp
  ) VALUES (
    'Michelle alaqad',
    'michellealaqad25@outlook.com',
    '+33769670033',
    '2025-08-23',
    'Mariage',
    'Château de Meouilles St-André-les-Alpes',
    '60',
    'null',
    'rejected',
    'Particular',
    'ultimo',
    '19/10/2024 10:44:29'::timestamp
  );
INSERT INTO external_budgets (
    client_name, client_email, client_phone,
    event_date, event_type, event_address, guest_count, meal_type,
    status, categoria, admin_comments, original_timestamp
  ) VALUES (
    'Bénédicte SCHUTZ',
    'beneschutz@gmail.com',
    '+33613934352 (whats app)',
    '2025-08-23',
    'Autre',
    '607 avenue du danemark 06190 RCM',
    'entre 35 et  45',
    'null',
    'accepted',
    'Particular',
    'null',
    '23/10/2024 17:45:29'::timestamp
  );
INSERT INTO external_budgets (
    client_name, client_email, client_phone,
    event_date, event_type, event_address, guest_count, meal_type,
    status, categoria, admin_comments, original_timestamp
  ) VALUES (
    'Katya Benmedjdoub',
    'katya.bnjb@gmail.com',
    '0618106751',
    '2025-04-05',
    'Autre',
    'Nice',
    '13',
    'null',
    'rejected',
    'Particular',
    'null',
    '23/10/2024 19:37:53'::timestamp
  );
INSERT INTO external_budgets (
    client_name, client_email, client_phone,
    event_date, event_type, event_address, guest_count, meal_type,
    status, categoria, admin_comments, original_timestamp
  ) VALUES (
    'Héloïse Chollier',
    'hchollier@gmail.com',
    '0769101981',
    '2025-06-07',
    'Mariage',
    'Domaine les Perpetus, route de la Bastidonne à Mirabeau, 84240 la tour D’aigues ',
    '130',
    'null',
    'rejected',
    'Particular',
    'null',
    '25/10/2024 16:41:27'::timestamp
  );
INSERT INTO external_budgets (
    client_name, client_email, client_phone,
    event_date, event_type, event_address, guest_count, meal_type,
    status, categoria, admin_comments, original_timestamp
  ) VALUES (
    'Falchero Julien',
    'julien.falchero@gmail.com',
    '0650991485',
    '2024-11-16',
    'Baptême',
    '141 chemin perdu, 06620 le Bar sur Loup',
    '50',
    'null',
    'pending',
    'Particular',
    'null',
    '26/10/2024 11:07:08'::timestamp
  );
INSERT INTO external_budgets (
    client_name, client_email, client_phone,
    event_date, event_type, event_address, guest_count, meal_type,
    status, categoria, admin_comments, original_timestamp
  ) VALUES (
    'Villalonga camille',
    'camillevillalonga@hotmail.fr',
    '666320508',
    '2025-06-28',
    'Mariage',
    'Cannes ',
    '75',
    'null',
    'accepted',
    'Particular',
    'null',
    '26/10/2024 15:30:17'::timestamp
  );
INSERT INTO external_budgets (
    client_name, client_email, client_phone,
    event_date, event_type, event_address, guest_count, meal_type,
    status, categoria, admin_comments, original_timestamp
  ) VALUES (
    'Girardi Aurélie ',
    'aurelie.massol@hotmail.fr',
    '0680866185',
    '2024-11-16',
    'Anniversaire',
    'Saint Martin de peille ',
    '20',
    'null',
    'pending',
    'Particular',
    'null',
    '26/10/2024 21:27:15'::timestamp
  );
INSERT INTO external_budgets (
    client_name, client_email, client_phone,
    event_date, event_type, event_address, guest_count, meal_type,
    status, categoria, admin_comments, original_timestamp
  ) VALUES (
    'Audrey denjean ',
    'audreyetjonas@gmail.com',
    '0662575870',
    '2025-05-30',
    'Anniversaire',
    '623 Chemin Du Ribas valbonne ',
    '45',
    'null',
    'rejected',
    'Particular',
    'null',
    '27/10/2024 7:43:10'::timestamp
  );
INSERT INTO external_budgets (
    client_name, client_email, client_phone,
    event_date, event_type, event_address, guest_count, meal_type,
    status, categoria, admin_comments, original_timestamp
  ) VALUES (
    'Besson aurore ',
    'aurore.besson@gmail.com',
    '0666719596',
    '2924-11-16',
    'Anniversaire',
    'Ahah',
    '25',
    'null',
    'pending',
    'Particular',
    'null',
    '29/10/2024 8:22:36'::timestamp
  );
INSERT INTO external_budgets (
    client_name, client_email, client_phone,
    event_date, event_type, event_address, guest_count, meal_type,
    status, categoria, admin_comments, original_timestamp
  ) VALUES (
    'Ariane Olivie',
    'ariane.olivie@gmail.com',
    '640626426',
    '2025-08-30',
    'Anniversaire',
    'Fayence',
    '40',
    'null',
    'rejected',
    'Particular',
    'mail enviado/ Relance el mail',
    '3/11/2024 21:39:50'::timestamp
  );
INSERT INTO external_budgets (
    client_name, client_email, client_phone,
    event_date, event_type, event_address, guest_count, meal_type,
    status, categoria, admin_comments, original_timestamp
  ) VALUES (
    'Sabbagh Joy',
    'joy@joyproduction.net',
    '0659481233',
    '2025-06-11',
    'Mariage',
    'Gassin',
    '150',
    'null',
    'rejected',
    'Empresa',
    'null',
    '5/11/2024 14:49:28'::timestamp
  );
INSERT INTO external_budgets (
    client_name, client_email, client_phone,
    event_date, event_type, event_address, guest_count, meal_type,
    status, categoria, admin_comments, original_timestamp
  ) VALUES (
    'Frederic saunier',
    'frederic.saunier130@orange.fr',
    '0615400992',
    '2025-03-16',
    'Anniversaire',
    '1 ch de la plage port de bouc 13110',
    'Environ 150 a 200',
    'null',
    'rejected',
    'Particular',
    'null',
    '6/11/2024 11:34:13'::timestamp
  );
INSERT INTO external_budgets (
    client_name, client_email, client_phone,
    event_date, event_type, event_address, guest_count, meal_type,
    status, categoria, admin_comments, original_timestamp
  ) VALUES (
    'Frederic saunier',
    'frederic.saunier130@orange.fr',
    '0615400992',
    '2025-03-16',
    'Anniversaire',
    '1 ch de la plage port de bouc 13110',
    'Environ 150 a 200',
    'null',
    'rejected',
    'Particular',
    'null',
    '6/11/2024 12:46:24'::timestamp
  );
INSERT INTO external_budgets (
    client_name, client_email, client_phone,
    event_date, event_type, event_address, guest_count, meal_type,
    status, categoria, admin_comments, original_timestamp
  ) VALUES (
    'Kyllian Bianchi-Luraschi ',
    'kylliant06@gmail.com',
    '0611073021',
    '2025-06-14',
    'Baptême',
    'Valdeblore ',
    '65',
    'null',
    'rejected',
    'Particular',
    'No disponibles',
    '8/11/2024 10:00:19'::timestamp
  );
INSERT INTO external_budgets (
    client_name, client_email, client_phone,
    event_date, event_type, event_address, guest_count, meal_type,
    status, categoria, admin_comments, original_timestamp
  ) VALUES (
    'Lentini Alexandre ',
    'lentini.alexandre@gmail.coml',
    '0619833512',
    '2025-06-07',
    'Mariage',
    'Grasse',
    '60',
    'null',
    'accepted',
    'Particular',
    'null',
    '9/11/2024 22:10:03'::timestamp
  );
INSERT INTO external_budgets (
    client_name, client_email, client_phone,
    event_date, event_type, event_address, guest_count, meal_type,
    status, categoria, admin_comments, original_timestamp
  ) VALUES (
    'BIAGI Sandy',
    'sbiagi@monaco.mc',
    '0607934379',
    '2025-05-24',
    'Anniversaire',
    'lantosque 06450',
    '50',
    'null',
    'rejected',
    'Particular',
    'No disponibles',
    '11/11/2024 14:37:03'::timestamp
  );
INSERT INTO external_budgets (
    client_name, client_email, client_phone,
    event_date, event_type, event_address, guest_count, meal_type,
    status, categoria, admin_comments, original_timestamp
  ) VALUES (
    'MAUGE GUILLAUME ',
    'g.mauge3@gmail.com',
    '0623622668',
    '2025-06-28',
    'Mariage',
    'Colored ranch puget sur argens 83480',
    '70',
    'null',
    'rejected',
    'Particular',
    'null',
    '11/11/2024 16:42:02'::timestamp
  );
INSERT INTO external_budgets (
    client_name, client_email, client_phone,
    event_date, event_type, event_address, guest_count, meal_type,
    status, categoria, admin_comments, original_timestamp
  ) VALUES (
    'Treille paul',
    'treille-paul@hotmail.fr',
    '0669315700',
    '2025-07-05',
    'Mariage',
    'Toulon',
    '100',
    'null',
    'rejected',
    'Particular',
    'null',
    '11/11/2024 20:34:37'::timestamp
  );
INSERT INTO external_budgets (
    client_name, client_email, client_phone,
    event_date, event_type, event_address, guest_count, meal_type,
    status, categoria, admin_comments, original_timestamp
  ) VALUES (
    'Blazi Shannon',
    'blazishannon@hotmail.fr',
    '0699115003',
    '2025-09-13',
    'Mariage',
    '1984, Route de la Pénétrante 06380 Sospel',
    '50',
    'null',
    'rejected',
    'Particular',
    'ultimo',
    '13/11/2024 12:43:38'::timestamp
  );
INSERT INTO external_budgets (
    client_name, client_email, client_phone,
    event_date, event_type, event_address, guest_count, meal_type,
    status, categoria, admin_comments, original_timestamp
  ) VALUES (
    'Mildred ducher ',
    'mildred12566@gmail.com',
    '0635157584',
    '2025-06-07',
    'Mariage',
    'Levens',
    '60',
    'null',
    'rejected',
    'Particular',
    'null',
    '16/11/2024 1:22:09'::timestamp
  );
INSERT INTO external_budgets (
    client_name, client_email, client_phone,
    event_date, event_type, event_address, guest_count, meal_type,
    status, categoria, admin_comments, original_timestamp
  ) VALUES (
    'Emmanuelle Bastard',
    'emmanuelleb83@yahoo.com',
    '0643154568',
    '2025-06-15',
    'Baptême',
    '552 Route Des Mayons',
    '60',
    'null',
    'rejected',
    'Particular',
    'null',
    '18/11/2024 10:25:51'::timestamp
  );
INSERT INTO external_budgets (
    client_name, client_email, client_phone,
    event_date, event_type, event_address, guest_count, meal_type,
    status, categoria, admin_comments, original_timestamp
  ) VALUES (
    'Bayer Charlyne',
    'charlynebayerg@gmail.com',
    '0659347876',
    NULL,
    'Mariage',
    'Lavandou',
    'Environ 25 personnes ',
    'null',
    'rejected',
    'Particular',
    'null',
    '21/11/2024 12:02:08'::timestamp
  );
INSERT INTO external_budgets (
    client_name, client_email, client_phone,
    event_date, event_type, event_address, guest_count, meal_type,
    status, categoria, admin_comments, original_timestamp
  ) VALUES (
    'ALAMEL CHRISTOPHE ',
    'krichou06@msn.com',
    '0642984696',
    '2025-04-05',
    'Anniversaire',
    'Salle des fêtes stade BLAUSASC 06440',
    '100',
    'null',
    'rejected',
    'Particular',
    'null',
    '21/11/2024 22:30:28'::timestamp
  );
INSERT INTO external_budgets (
    client_name, client_email, client_phone,
    event_date, event_type, event_address, guest_count, meal_type,
    status, categoria, admin_comments, original_timestamp
  ) VALUES (
    'Maryline Courtadon',
    'maryline2323@gmail.com',
    '0630561185',
    '2025-04-12',
    'Anniversaire',
    'le Tignet',
    '50',
    'null',
    'rejected',
    'Particular',
    'No estamos',
    '22/11/2024 13:11:19'::timestamp
  );
INSERT INTO external_budgets (
    client_name, client_email, client_phone,
    event_date, event_type, event_address, guest_count, meal_type,
    status, categoria, admin_comments, original_timestamp
  ) VALUES (
    'Catherine Bosc',
    'cbosc@yaho.fr',
    '0750521445',
    '2025-08-06',
    'Anniversaire',
    'Antibes',
    '50',
    'null',
    'rejected',
    'Particular',
    'null',
    '26/11/2024 9:00:07'::timestamp
  );
INSERT INTO external_budgets (
    client_name, client_email, client_phone,
    event_date, event_type, event_address, guest_count, meal_type,
    status, categoria, admin_comments, original_timestamp
  ) VALUES (
    'Maria Sikora ',
    'maria.sikora@hotmail.fr',
    '0607854837',
    '2025-07-17',
    'Autre',
    'Ailgun 06',
    '50',
    'null',
    'rejected',
    'null',
    'null',
    '27/11/2024 11:50:22'::timestamp
  );
INSERT INTO external_budgets (
    client_name, client_email, client_phone,
    event_date, event_type, event_address, guest_count, meal_type,
    status, categoria, admin_comments, original_timestamp
  ) VALUES (
    'sandra lequien',
    'lequien.sandra@gmail.com',
    '+33621646745',
    '2026-10-03',
    'Mariage',
    'domaine les aigas 06380 sospel',
    '110',
    'null',
    'rejected',
    'null',
    'Traiteur tradition,el',
    '27/11/2024 13:43:01'::timestamp
  );
INSERT INTO external_budgets (
    client_name, client_email, client_phone,
    event_date, event_type, event_address, guest_count, meal_type,
    status, categoria, admin_comments, original_timestamp
  ) VALUES (
    'Manon RONDEL',
    'mrondel@nge.fr',
    '0658400657',
    '2024-12-13',
    'Corporatif',
    'Rue du bon air à Antibes',
    '35',
    'null',
    'pending',
    'null',
    'null',
    '29/11/2024 13:42:21'::timestamp
  );
INSERT INTO external_budgets (
    client_name, client_email, client_phone,
    event_date, event_type, event_address, guest_count, meal_type,
    status, categoria, admin_comments, original_timestamp
  ) VALUES (
    'Marilyn Descoins',
    'marilyn.descoins@hotmail.fr',
    '+65 87694050',
    '2025-07-13',
    'Anniversaire',
    'Saint Paul de Vence',
    '60',
    'null',
    'rejected',
    'null',
    'null',
    '1/12/2024 8:15:38'::timestamp
  );
INSERT INTO external_budgets (
    client_name, client_email, client_phone,
    event_date, event_type, event_address, guest_count, meal_type,
    status, categoria, admin_comments, original_timestamp
  ) VALUES (
    'Valérie Simon ',
    'Valerie.simon83310@gmail.com',
    '0617111111',
    '2025-08-30',
    'Mariage',
    'Vidauban ',
    '60',
    'null',
    'rejected',
    'null',
    'null',
    '1/12/2024 15:32:07'::timestamp
  );
INSERT INTO external_budgets (
    client_name, client_email, client_phone,
    event_date, event_type, event_address, guest_count, meal_type,
    status, categoria, admin_comments, original_timestamp
  ) VALUES (
    'Jessica Frasnetti',
    'jessica.frasnetti@gmail.com',
    '0632515438',
    '2025-06-21',
    'Mariage',
    'Roquebrune cap Martin ',
    '100',
    'null',
    'accepted',
    'null',
    'null',
    '10/12/2024 10:15:16'::timestamp
  );
INSERT INTO external_budgets (
    client_name, client_email, client_phone,
    event_date, event_type, event_address, guest_count, meal_type,
    status, categoria, admin_comments, original_timestamp
  ) VALUES (
    'VISNENZA KARINE',
    'visnenza.karine@gmail.com',
    '0617305633',
    '2025-07-19',
    'Mariage',
    '1930 CHEMIN DES RIVES DE RIMIEZ',
    '40',
    'null',
    'accepted',
    'null',
    'null',
    '26/12/2024 18:00:06'::timestamp
  );
INSERT INTO external_budgets (
    client_name, client_email, client_phone,
    event_date, event_type, event_address, guest_count, meal_type,
    status, categoria, admin_comments, original_timestamp
  ) VALUES (
    'CAROLINE BIAGIOTTI',
    'carojb@yahoo.fr',
    '0603015225',
    '2025-07-13',
    'Baptême',
    '96 avenue de gairaut',
    '60/80',
    'null',
    'rejected',
    'null',
    'Devis sin postre 47 por persona',
    '27/12/2024 22:11:52'::timestamp
  );
INSERT INTO external_budgets (
    client_name, client_email, client_phone,
    event_date, event_type, event_address, guest_count, meal_type,
    status, categoria, admin_comments, original_timestamp
  ) VALUES (
    'HAAS Dominique',
    'dominique.haas57@orange.fr',
    '0677773758',
    '2025-06-07',
    'Anniversaire',
    '76 Bis, Avenue Du Dr Picaud, 06150 Cannes',
    '30',
    'null',
    'accepted',
    'null',
    'Ir a ver el lugar en mayo',
    '28/12/2024 20:19:17'::timestamp
  );
INSERT INTO external_budgets (
    client_name, client_email, client_phone,
    event_date, event_type, event_address, guest_count, meal_type,
    status, categoria, admin_comments, original_timestamp
  ) VALUES (
    'POIRE Laure-Sophie',
    'lauresophie.poire@gmail.com',
    '0649811883',
    '2025-07-13',
    'Mariage',
    '301 chemin des bassins 06530 SAINT CEZAIRE SUR SIAGNE',
    '40',
    'null',
    'accepted',
    'null',
    'Casi seguro',
    '2/01/2025 15:32:22'::timestamp
  );
INSERT INTO external_budgets (
    client_name, client_email, client_phone,
    event_date, event_type, event_address, guest_count, meal_type,
    status, categoria, admin_comments, original_timestamp
  ) VALUES (
    'Fabrice',
    'plancon.fabrice@gmail.com',
    '0648707531',
    '2025-05-31',
    'Anniversaire',
    '34 Avenue de la Pinède la bouverie 83520 roquebrune sur argens',
    '50/60',
    'null',
    'rejected',
    'null',
    'null',
    '3/01/2025 14:43:21'::timestamp
  );
INSERT INTO external_budgets (
    client_name, client_email, client_phone,
    event_date, event_type, event_address, guest_count, meal_type,
    status, categoria, admin_comments, original_timestamp
  ) VALUES (
    'Sébastien',
    's.repiquet@gmail.com',
    '0608230241',
    '2025-09-13',
    'Anniversaire',
    'Var',
    '40',
    'null',
    'rejected',
    'null',
    'null',
    '3/01/2025 20:12:34'::timestamp
  );
INSERT INTO external_budgets (
    client_name, client_email, client_phone,
    event_date, event_type, event_address, guest_count, meal_type,
    status, categoria, admin_comments, original_timestamp
  ) VALUES (
    'Martinez Lisa ',
    'lisa.martinez.pro@gmail.com',
    '0760135246',
    '2025-06-21',
    'Anniversaire',
    '06140 vence ',
    '35',
    'null',
    'rejected',
    'null',
    'null',
    '4/01/2025 23:58:59'::timestamp
  );
INSERT INTO external_budgets (
    client_name, client_email, client_phone,
    event_date, event_type, event_address, guest_count, meal_type,
    status, categoria, admin_comments, original_timestamp
  ) VALUES (
    'GROBOST Romain ',
    'romain.grobost@hotmail.fr',
    '0678862705',
    '2025-06-21',
    'Autre',
    'Montauroux',
    '15',
    'null',
    'accepted',
    'null',
    'null',
    '12/01/2025 14:37:40'::timestamp
  );
INSERT INTO external_budgets (
    client_name, client_email, client_phone,
    event_date, event_type, event_address, guest_count, meal_type,
    status, categoria, admin_comments, original_timestamp
  ) VALUES (
    'Coline Trobrillant ',
    'coline.trobrillant@icloud.com',
    '07 51 64 30 99',
    '2020-08-16',
    'Mariage',
    'Domaine La Gayolle',
    '115',
    'null',
    'rejected',
    'null',
    'null',
    '12/01/2025 19:55:45'::timestamp
  );
INSERT INTO external_budgets (
    client_name, client_email, client_phone,
    event_date, event_type, event_address, guest_count, meal_type,
    status, categoria, admin_comments, original_timestamp
  ) VALUES (
    'Leila Mac Allister',
    'leilamacallister@hotmail.com',
    '33769978750',
    '2025-05-31',
    'Mariage',
    'Nice ',
    '40',
    'null',
    'rejected',
    'null',
    'null',
    '14/01/2025 19:17:16'::timestamp
  );
INSERT INTO external_budgets (
    client_name, client_email, client_phone,
    event_date, event_type, event_address, guest_count, meal_type,
    status, categoria, admin_comments, original_timestamp
  ) VALUES (
    'PONS Marc',
    'pons_marc@hotmail.com',
    '0609985288',
    '1975-06-10',
    'Anniversaire',
    '8 Chemin de la Tramontana 06200 Nice',
    '60',
    'null',
    'accepted',
    'null',
    'null',
    '16/01/2025 8:29:00'::timestamp
  );
INSERT INTO external_budgets (
    client_name, client_email, client_phone,
    event_date, event_type, event_address, guest_count, meal_type,
    status, categoria, admin_comments, original_timestamp
  ) VALUES (
    'Elsa RAYNAUD ',
    'elsa.baptiste.rc@gmail.com',
    '0699719393',
    '2025-06-28',
    'Mariage',
    'La Martre ',
    '80',
    'null',
    'rejected',
    'null',
    'null',
    '16/01/2025 10:37:31'::timestamp
  );
INSERT INTO external_budgets (
    client_name, client_email, client_phone,
    event_date, event_type, event_address, guest_count, meal_type,
    status, categoria, admin_comments, original_timestamp
  ) VALUES (
    'Manzoli francesco',
    'manzolifrancesco3@gmail.com',
    '0615787813',
    '2025-06-28',
    'Mariage',
    '76 allee du pres, le Pilon 06390 contes',
    '50',
    'null',
    'rejected',
    'null',
    'no libres en la fecha',
    '17/01/2025 10:23:55'::timestamp
  );
INSERT INTO external_budgets (
    client_name, client_email, client_phone,
    event_date, event_type, event_address, guest_count, meal_type,
    status, categoria, admin_comments, original_timestamp
  ) VALUES (
    'Baffert-Fantin Nathalie',
    'nathalie.baffert@francetv.fr',
    '0634284625',
    '2025-06-28',
    'Mariage',
    '123 chemin des caroubiers Mougin',
    '60',
    'null',
    'rejected',
    'null',
    'no libres en la fecha',
    '18/01/2025 11:38:21'::timestamp
  );
INSERT INTO external_budgets (
    client_name, client_email, client_phone,
    event_date, event_type, event_address, guest_count, meal_type,
    status, categoria, admin_comments, original_timestamp
  ) VALUES (
    'Garcia Béatrice ',
    'garcia3011@gmail.com',
    '0681732533',
    '2025-08-30',
    'Anniversaire',
    '68 chemin font de ribe et vallon 06610 la gaude ',
    '60',
    'null',
    'rejected',
    'null',
    'null',
    '19/01/2025 17:29:58'::timestamp
  );
INSERT INTO external_budgets (
    client_name, client_email, client_phone,
    event_date, event_type, event_address, guest_count, meal_type,
    status, categoria, admin_comments, original_timestamp
  ) VALUES (
    'Neron Patricia ',
    'plutran@yahoo.fr',
    '0617624448',
    '2025-05-03',
    'Anniversaire',
    'LeMas Clairval Peymeinade',
    '50',
    'null',
    'rejected',
    'null',
    'null',
    '20/01/2025 13:04:15'::timestamp
  );
INSERT INTO external_budgets (
    client_name, client_email, client_phone,
    event_date, event_type, event_address, guest_count, meal_type,
    status, categoria, admin_comments, original_timestamp
  ) VALUES (
    'Piro Jean-Vincent',
    'jvpiro@shiva-finance.fr',
    '0650121380',
    '2025-07-12',
    'Anniversaire',
    '131 avenue de rimiez 06100 Nice',
    '25/30',
    'null',
    'rejected',
    'null',
    'Esperar 2 eventos ya ese dia',
    '23/01/2025 8:10:29'::timestamp
  );
INSERT INTO external_budgets (
    client_name, client_email, client_phone,
    event_date, event_type, event_address, guest_count, meal_type,
    status, categoria, admin_comments, original_timestamp
  ) VALUES (
    'MEDECIN Stephanie',
    'medecinstephanie@gmail.com',
    '0624763425',
    '2025-08-30',
    'Mariage',
    '166 Chemin de Nice 06670 Saint Martin du Var',
    '70',
    'null',
    'rejected',
    'null',
    'BUDGET',
    '23/01/2025 11:19:59'::timestamp
  );
INSERT INTO external_budgets (
    client_name, client_email, client_phone,
    event_date, event_type, event_address, guest_count, meal_type,
    status, categoria, admin_comments, original_timestamp
  ) VALUES (
    'Cat Rhodes',
    'destinations@georginaroseevents.co.uk',
    '07557535726',
    '2025-06-29',
    'Autre',
    '2807 Route de Mazan, 84200 Carpentras, France',
    '100',
    'null',
    'rejected',
    'null',
    'null',
    '23/01/2025 13:00:45'::timestamp
  );
INSERT INTO external_budgets (
    client_name, client_email, client_phone,
    event_date, event_type, event_address, guest_count, meal_type,
    status, categoria, admin_comments, original_timestamp
  ) VALUES (
    'Wolfgang Neidhardt ',
    'wolfgang-neidhardt@outlook.com',
    '0643532021',
    '2025-02-14',
    'Anniversaire',
    'Chateauneuf de grasse ',
    '10-12',
    'null',
    'rejected',
    'null',
    'null',
    '25/01/2025 17:40:30'::timestamp
  );
INSERT INTO external_budgets (
    client_name, client_email, client_phone,
    event_date, event_type, event_address, guest_count, meal_type,
    status, categoria, admin_comments, original_timestamp
  ) VALUES (
    'Sandy dousseaud ',
    'sandydousseaud@yahoo.fr',
    '0661374503',
    '2025-03-15',
    'Anniversaire',
    '8 av des chenes antibes',
    '20',
    'null',
    'rejected',
    'null',
    'Evento de 2 dias',
    '25/01/2025 19:04:02'::timestamp
  );
INSERT INTO external_budgets (
    client_name, client_email, client_phone,
    event_date, event_type, event_address, guest_count, meal_type,
    status, categoria, admin_comments, original_timestamp
  ) VALUES (
    'Bernard Christine ',
    'criyoo@gmail.com',
    '0675069607',
    '2025-06-14',
    'Anniversaire',
    '47 Parc Saint Exupery - 06100 Nice',
    '50',
    'null',
    'accepted',
    'null',
    'null',
    '27/01/2025 9:25:10'::timestamp
  );
INSERT INTO external_budgets (
    client_name, client_email, client_phone,
    event_date, event_type, event_address, guest_count, meal_type,
    status, categoria, admin_comments, original_timestamp
  ) VALUES (
    'Cauvin Celia',
    'celia.riviere83@gmail.com',
    '0616439011',
    '2025-05-03',
    'Anniversaire',
    'Cuers',
    '25',
    'null',
    'rejected',
    'null',
    'null',
    '29/01/2025 11:50:02'::timestamp
  );
INSERT INTO external_budgets (
    client_name, client_email, client_phone,
    event_date, event_type, event_address, guest_count, meal_type,
    status, categoria, admin_comments, original_timestamp
  ) VALUES (
    'Klara fine ',
    'klara.fine124@gmail.com',
    '+447887941248',
    '2025-05-25',
    'Autre',
    '42 Boulevard Settimelli Lazare, Villefranche sur Mer ',
    '23',
    'null',
    'rejected',
    'null',
    'null',
    '29/01/2025 19:40:08'::timestamp
  );
INSERT INTO external_budgets (
    client_name, client_email, client_phone,
    event_date, event_type, event_address, guest_count, meal_type,
    status, categoria, admin_comments, original_timestamp
  ) VALUES (
    'OREGGIA Philippe',
    'philippe.oreg@gmail.com',
    '0775232799',
    '2025-03-15',
    'Anniversaire',
    '67, chemin des Caucours - 06800 CAGNES SUR MER',
    '35',
    'null',
    'rejected',
    'null',
    'null',
    '30/01/2025 12:03:15'::timestamp
  );
INSERT INTO external_budgets (
    client_name, client_email, client_phone,
    event_date, event_type, event_address, guest_count, meal_type,
    status, categoria, admin_comments, original_timestamp
  ) VALUES (
    'Lazzaro Hélène ',
    'lnalaz@hotmail.fr',
    '06 14 13 39 58 ',
    '2025-10-18',
    'Mariage',
    'Antibes',
    '100',
    'null',
    'rejected',
    'null',
    'null',
    '30/01/2025 15:05:46'::timestamp
  );
INSERT INTO external_budgets (
    client_name, client_email, client_phone,
    event_date, event_type, event_address, guest_count, meal_type,
    status, categoria, admin_comments, original_timestamp
  ) VALUES (
    'Bizart Stessie ',
    'bizartstessie@gmail.com',
    '0666452556',
    '2025-06-07',
    'Anniversaire',
    '3 avenue des pléiades , 06110 le Cannet ',
    '40',
    'null',
    'rejected',
    'null',
    'null',
    '30/01/2025 18:59:27'::timestamp
  );
INSERT INTO external_budgets (
    client_name, client_email, client_phone,
    event_date, event_type, event_address, guest_count, meal_type,
    status, categoria, admin_comments, original_timestamp
  ) VALUES (
    'Verlhac Tressy (chargée de communication)',
    'ambiancegazon@gmail.com',
    '0685668513',
    '2025-06-20',
    'Corporatif',
    '261 avenue Saint-Just, 83130 La Garde',
    '60',
    'null',
    'rejected',
    'null',
    'muy lejos',
    '31/01/2025 15:52:27'::timestamp
  );
INSERT INTO external_budgets (
    client_name, client_email, client_phone,
    event_date, event_type, event_address, guest_count, meal_type,
    status, categoria, admin_comments, original_timestamp
  ) VALUES (
    'YHUEL Sylvanie',
    'syhl13600@gmail.com',
    '0618061663',
    '2026-09-05',
    'Mariage',
    'A definir (vers Hyères, la Londe-les-Maures)',
    '50',
    'null',
    'rejected',
    'null',
    'null',
    '1/02/2025 11:03:33'::timestamp
  );
INSERT INTO external_budgets (
    client_name, client_email, client_phone,
    event_date, event_type, event_address, guest_count, meal_type,
    status, categoria, admin_comments, original_timestamp
  ) VALUES (
    'donnadieu chloe ',
    'chloedonnadieu2512@gmail.com',
    '0618505643',
    '2025-09-20',
    'Mariage',
    '31 rue jean Vadon 83440 Mons',
    '23',
    'null',
    'accepted',
    'null',
    'null',
    '2/02/2025 20:50:33'::timestamp
  );
INSERT INTO external_budgets (
    client_name, client_email, client_phone,
    event_date, event_type, event_address, guest_count, meal_type,
    status, categoria, admin_comments, original_timestamp
  ) VALUES (
    'Delia SZABO',
    'delia.szabo.bellon@gmail.com',
    '0617580251',
    '2026-06-18',
    'Mariage',
    'Bastide du roy Antibes',
    '110',
    'null',
    'rejected',
    'null',
    'ESPERAR',
    '3/02/2025 18:41:06'::timestamp
  );
INSERT INTO external_budgets (
    client_name, client_email, client_phone,
    event_date, event_type, event_address, guest_count, meal_type,
    status, categoria, admin_comments, original_timestamp
  ) VALUES (
    'Jean-Philippe descoins ',
    'delph77200@hotmail.fr',
    '0633446479',
    '2025-06-15',
    'Anniversaire',
    '91 avenue Général de Gaulle 06250 Mougins',
    '16',
    'null',
    'accepted',
    'null',
    'null',
    '4/02/2025 19:01:38'::timestamp
  );
INSERT INTO external_budgets (
    client_name, client_email, client_phone,
    event_date, event_type, event_address, guest_count, meal_type,
    status, categoria, admin_comments, original_timestamp
  ) VALUES (
    'PASCUCCI NATHALIE ',
    'nathalie.pascucci@ccas-nice.fr',
    '0611175755',
    '2025-03-09',
    'Anniversaire',
    'CARROS',
    '15',
    'null',
    'rejected',
    'null',
    'null',
    '5/02/2025 16:05:48'::timestamp
  );
INSERT INTO external_budgets (
    client_name, client_email, client_phone,
    event_date, event_type, event_address, guest_count, meal_type,
    status, categoria, admin_comments, original_timestamp
  ) VALUES (
    'Méan Jean-François ',
    'jean-francois.mean@mrogroup.net',
    '0032495233707',
    '2025-03-10',
    'Autre',
    'Avenue Commandant Bret 19 CANNES',
    '50',
    'null',
    'rejected',
    'null',
    'null',
    '6/02/2025 11:15:29'::timestamp
  );
INSERT INTO external_budgets (
    client_name, client_email, client_phone,
    event_date, event_type, event_address, guest_count, meal_type,
    status, categoria, admin_comments, original_timestamp
  ) VALUES (
    'Petit Sandra ',
    'spetit@diocese.mc',
    '0680867459',
    '2025-06-14',
    'Autre',
    'Eglise Saint Nicolas place du Campanin 98000 Monaco ',
    '200',
    'null',
    'rejected',
    'null',
    'NO disponibles',
    '7/02/2025 8:18:15'::timestamp
  );
INSERT INTO external_budgets (
    client_name, client_email, client_phone,
    event_date, event_type, event_address, guest_count, meal_type,
    status, categoria, admin_comments, original_timestamp
  ) VALUES (
    'aranda bernadette',
    'babettearanda7@hotmail.com',
    '0609821887',
    '2025-05-24',
    'Anniversaire',
    'route de la billoire 06640 SAINT JEANNET',
    '40-45',
    'null',
    'rejected',
    'null',
    'NO disponibles',
    '7/02/2025 12:33:17'::timestamp
  );
INSERT INTO external_budgets (
    client_name, client_email, client_phone,
    event_date, event_type, event_address, guest_count, meal_type,
    status, categoria, admin_comments, original_timestamp
  ) VALUES (
    'Touseau-Bueno',
    'sarahmandre@gmail.com',
    '0629617207',
    '2025-05-24',
    'Anniversaire',
    'Chalet de l''Albaréa à Peïra Cava',
    '50',
    'null',
    'rejected',
    'null',
    'NO disponibles',
    '8/02/2025 17:05:41'::timestamp
  );
INSERT INTO external_budgets (
    client_name, client_email, client_phone,
    event_date, event_type, event_address, guest_count, meal_type,
    status, categoria, admin_comments, original_timestamp
  ) VALUES (
    'Gastineau marie',
    'marie.gastineau5606@gmail.com',
    '0662870026',
    '2025-05-10',
    'Mariage',
    '72 Route de Villefranche',
    '40',
    'null',
    'rejected',
    'null',
    'BUdget',
    '9/02/2025 20:38:15'::timestamp
  );
INSERT INTO external_budgets (
    client_name, client_email, client_phone,
    event_date, event_type, event_address, guest_count, meal_type,
    status, categoria, admin_comments, original_timestamp
  ) VALUES (
    'Casanova Antoine ',
    'casanovaa04@gmail.com',
    '06 31 38 35 68',
    '2025-04-13',
    'Autre',
    '13 A RUE ADRIEN BADIN',
    '40',
    'null',
    'pending',
    'null',
    'Muy lejos',
    '10/02/2025 9:51:49'::timestamp
  );
INSERT INTO external_budgets (
    client_name, client_email, client_phone,
    event_date, event_type, event_address, guest_count, meal_type,
    status, categoria, admin_comments, original_timestamp
  ) VALUES (
    'Ninu Dominique ',
    'aledo2@sfr.fr',
    '0621071650',
    '2025-05-18',
    'Anniversaire',
    '113 chemin de Crémat. 06200 Nice',
    '20',
    'null',
    'rejected',
    'null',
    'null',
    '10/02/2025 13:34:46'::timestamp
  );
INSERT INTO external_budgets (
    client_name, client_email, client_phone,
    event_date, event_type, event_address, guest_count, meal_type,
    status, categoria, admin_comments, original_timestamp
  ) VALUES (
    'Carla HERVÉ ',
    'carla.herve916@gmail.com',
    '0787000044',
    '2025-06-21',
    'Anniversaire',
    '516 Chemin des Moyennes Bréguières, 06600 Antibes',
    '30',
    'null',
    'rejected',
    'null',
    'Ya 2 eventos ese dia',
    '10/02/2025 20:17:38'::timestamp
  );
INSERT INTO external_budgets (
    client_name, client_email, client_phone,
    event_date, event_type, event_address, guest_count, meal_type,
    status, categoria, admin_comments, original_timestamp
  ) VALUES (
    'Ferreira Anne-laure ',
    'annelaurelacfournier@hotmail.fr',
    '0660878188',
    '2025-05-18',
    'Autre',
    '45 avenue Joseph durandy- 06200 Nice ',
    '30',
    'null',
    'rejected',
    'null',
    'Traiteur traditionnel',
    '12/02/2025 12:07:46'::timestamp
  );
INSERT INTO external_budgets (
    client_name, client_email, client_phone,
    event_date, event_type, event_address, guest_count, meal_type,
    status, categoria, admin_comments, original_timestamp
  ) VALUES (
    'Kashtelyan Mikhail ',
    'misha.kas@hotmail.com',
    '0640622684',
    '2025-02-22',
    'Anniversaire',
    'La Turbie ',
    '20',
    'null',
    'rejected',
    'null',
    'null',
    '12/02/2025 15:31:17'::timestamp
  );
INSERT INTO external_budgets (
    client_name, client_email, client_phone,
    event_date, event_type, event_address, guest_count, meal_type,
    status, categoria, admin_comments, original_timestamp
  ) VALUES (
    'Juanes jerome',
    'jerome.juanes@hotmail.fr',
    '0601286646',
    '2025-05-03',
    'Anniversaire',
    'Saint martin du var ',
    'Quarantaine ',
    'null',
    'rejected',
    'null',
    'ESPERAR',
    '12/02/2025 20:09:34'::timestamp
  );
INSERT INTO external_budgets (
    client_name, client_email, client_phone,
    event_date, event_type, event_address, guest_count, meal_type,
    status, categoria, admin_comments, original_timestamp
  ) VALUES (
    'Glorie Davina ',
    'info@varconsultancy.fr',
    '0652424178',
    '2025-07-12',
    'Anniversaire',
    'Chemin de Faou Nord, 83510 Lorgues',
    '50',
    'null',
    'rejected',
    'null',
    'null',
    '13/02/2025 9:10:33'::timestamp
  );
INSERT INTO external_budgets (
    client_name, client_email, client_phone,
    event_date, event_type, event_address, guest_count, meal_type,
    status, categoria, admin_comments, original_timestamp
  ) VALUES (
    'Flora GIACOBBI',
    'fg@pgs-conseils.com',
    '0650128661',
    '2025-03-29',
    'Anniversaire',
    'La turbie',
    '25',
    'null',
    'rejected',
    'null',
    'No disponibles',
    '13/02/2025 17:42:14'::timestamp
  );
INSERT INTO external_budgets (
    client_name, client_email, client_phone,
    event_date, event_type, event_address, guest_count, meal_type,
    status, categoria, admin_comments, original_timestamp
  ) VALUES (
    'Viola Alexandra',
    'rombergalexandra580@gmail.com',
    '0670961799',
    '2025-07-19',
    'Anniversaire',
    '54 corniche des Oliviers 06000 Nice',
    'À préciser mais 65 ',
    'null',
    'accepted',
    'null',
    'null',
    '14/02/2025 8:48:32'::timestamp
  );
INSERT INTO external_budgets (
    client_name, client_email, client_phone,
    event_date, event_type, event_address, guest_count, meal_type,
    status, categoria, admin_comments, original_timestamp
  ) VALUES (
    'Malvestiti Julie ',
    'julie.malvestiti@hotmail.fr',
    '0682467428',
    '2025-03-22',
    'Anniversaire',
    'Bandol ',
    '14',
    'null',
    'rejected',
    'null',
    'No acepto el precio',
    '14/02/2025 23:18:01'::timestamp
  );
INSERT INTO external_budgets (
    client_name, client_email, client_phone,
    event_date, event_type, event_address, guest_count, meal_type,
    status, categoria, admin_comments, original_timestamp
  ) VALUES (
    'Giulia Hayotte',
    'giulia.cutuli@gmail.com',
    '0650742399',
    '2025-08-30',
    'Anniversaire',
    'Vence',
    '30',
    'null',
    'rejected',
    'null',
    'null',
    '16/02/2025 8:47:15'::timestamp
  );
INSERT INTO external_budgets (
    client_name, client_email, client_phone,
    event_date, event_type, event_address, guest_count, meal_type,
    status, categoria, admin_comments, original_timestamp
  ) VALUES (
    'Betty Pina',
    'betty.sbbl@gmail.com',
    '061363908',
    '2025-05-30',
    'Autre',
    'Ch des vallons peymeinade',
    '30',
    'null',
    'rejected',
    'null',
    'null',
    '16/02/2025 12:59:09'::timestamp
  );
INSERT INTO external_budgets (
    client_name, client_email, client_phone,
    event_date, event_type, event_address, guest_count, meal_type,
    status, categoria, admin_comments, original_timestamp
  ) VALUES (
    'Quinzat Lamia ',
    'lamia.quinzat@laposte.net',
    '0658660198',
    '2025-03-29',
    'Anniversaire',
    '597 chemin de cabrol villa campo bello 06580 Pégomas ',
    '25',
    'null',
    'rejected',
    'null',
    'No disponibles',
    '16/02/2025 20:45:17'::timestamp
  );
INSERT INTO external_budgets (
    client_name, client_email, client_phone,
    event_date, event_type, event_address, guest_count, meal_type,
    status, categoria, admin_comments, original_timestamp
  ) VALUES (
    'Canu Claire et Thierry ',
    'canugrip@gmail.com',
    '0687415852',
    '2025-06-07',
    'Anniversaire',
    '19 placette des Strélitzias 83600 Fréjus ',
    '40/45',
    'null',
    'rejected',
    'null',
    'No disponibles',
    '17/02/2025 12:05:06'::timestamp
  );
INSERT INTO external_budgets (
    client_name, client_email, client_phone,
    event_date, event_type, event_address, guest_count, meal_type,
    status, categoria, admin_comments, original_timestamp
  ) VALUES (
    'Eymard Sprincia ',
    'sprinciaeymard@gmail.com',
    '0652471568',
    '2025-03-22',
    'Anniversaire',
    '21 chemin des frères Garbero 06600 Antibes ',
    '50',
    'null',
    'rejected',
    'null',
    'No disponibles',
    '18/02/2025 16:47:29'::timestamp
  );
INSERT INTO external_budgets (
    client_name, client_email, client_phone,
    event_date, event_type, event_address, guest_count, meal_type,
    status, categoria, admin_comments, original_timestamp
  ) VALUES (
    'Louis Jessica',
    'jessica.louis06@gmail.com',
    '0781454507',
    '2025-06-22',
    'Baptême',
    '55 allée des abeilles 06390 Contes',
    '70',
    'null',
    'rejected',
    'null',
    'null',
    '19/02/2025 14:18:08'::timestamp
  );
INSERT INTO external_budgets (
    client_name, client_email, client_phone,
    event_date, event_type, event_address, guest_count, meal_type,
    status, categoria, admin_comments, original_timestamp
  ) VALUES (
    'FLORENT Monilaure',
    'lauremoni@orange.fr',
    '06/50/63/70/93',
    '2025-09-21',
    'Autre',
    '495 chemin Chabara 83460 Les Arcs',
    '70 à 80 (à confirmer)',
    'null',
    'rejected',
    'null',
    'esperar junio relanzar',
    '19/02/2025 17:51:56'::timestamp
  );
INSERT INTO external_budgets (
    client_name, client_email, client_phone,
    event_date, event_type, event_address, guest_count, meal_type,
    status, categoria, admin_comments, original_timestamp
  ) VALUES (
    'Bizet Caroline ',
    'lacaveetsesterroirscaroline@gmail.com',
    '0685533218',
    '2025-03-22',
    'Autre',
    '1 rue de l’église 83490 le muy',
    'Entre 50 et 70',
    'null',
    'rejected',
    'null',
    'No disponibles',
    '20/02/2025 18:54:48'::timestamp
  );
INSERT INTO external_budgets (
    client_name, client_email, client_phone,
    event_date, event_type, event_address, guest_count, meal_type,
    status, categoria, admin_comments, original_timestamp
  ) VALUES (
    'Charlot Bénédicte',
    'benedicte.guyanespace@yahoo.fr',
    '0662624014',
    '2025-04-26',
    'Anniversaire',
    '1733 route de saint Laurent 06610 la gaude',
    '20',
    'null',
    'rejected',
    'null',
    'null',
    '23/02/2025 6:55:27'::timestamp
  );
INSERT INTO external_budgets (
    client_name, client_email, client_phone,
    event_date, event_type, event_address, guest_count, meal_type,
    status, categoria, admin_comments, original_timestamp
  ) VALUES (
    'Freneix Mathieu ',
    'grock64@hotmail.com',
    '0678111182',
    '2025-07-12',
    'Mariage',
    'Espace Terre de siagne 98 chemin Alain Martin, 06530 Saint-Cézaire-sur-Siagne',
    '70',
    'null',
    'rejected',
    'null',
    'null',
    '23/02/2025 12:45:30'::timestamp
  );
INSERT INTO external_budgets (
    client_name, client_email, client_phone,
    event_date, event_type, event_address, guest_count, meal_type,
    status, categoria, admin_comments, original_timestamp
  ) VALUES (
    'Jessica Marcou',
    'jessica.marcou@comback.fr',
    '0661955215',
    '2025-04-21',
    'Anniversaire',
    'Berre les alpes',
    '16',
    'null',
    'rejected',
    'null',
    'null',
    '24/02/2025 21:50:25'::timestamp
  );
INSERT INTO external_budgets (
    client_name, client_email, client_phone,
    event_date, event_type, event_address, guest_count, meal_type,
    status, categoria, admin_comments, original_timestamp
  ) VALUES (
    'Moser Christine ',
    'chriskat.m@neuf.fr',
    '0616415018',
    '2025-04-26',
    'Anniversaire',
    'Bendejun 06390',
    '40 personnes ',
    'null',
    'rejected',
    'null',
    'null',
    '25/02/2025 15:14:59'::timestamp
  );
INSERT INTO external_budgets (
    client_name, client_email, client_phone,
    event_date, event_type, event_address, guest_count, meal_type,
    status, categoria, admin_comments, original_timestamp
  ) VALUES (
    'Aurelie Bellisi ',
    'aureliebellisi@gmail.com',
    '603908255',
    '2025-05-10',
    'Baptême',
    'Saint-Auban (06850) ',
    '50',
    'null',
    'rejected',
    'null',
    'null',
    '26/02/2025 14:59:06'::timestamp
  );
INSERT INTO external_budgets (
    client_name, client_email, client_phone,
    event_date, event_type, event_address, guest_count, meal_type,
    status, categoria, admin_comments, original_timestamp
  ) VALUES (
    'Bardine Denis ',
    'bardine.valerie@wanadoo.fr',
    '0674512788',
    '2025-07-13',
    'Mariage',
    '612 route de st cézaire 83440 callian ',
    '40',
    'null',
    'accepted',
    'null',
    'null',
    '26/02/2025 15:34:35'::timestamp
  );
INSERT INTO external_budgets (
    client_name, client_email, client_phone,
    event_date, event_type, event_address, guest_count, meal_type,
    status, categoria, admin_comments, original_timestamp
  ) VALUES (
    'Murat Laetitia',
    'laetidangelo@hotmail.com',
    '0620745765',
    '2025-05-03',
    'Autre',
    '12 impasse François Tuby 06150 Cannes',
    '40',
    'null',
    'rejected',
    'null',
    'null',
    '26/02/2025 19:05:49'::timestamp
  );
INSERT INTO external_budgets (
    client_name, client_email, client_phone,
    event_date, event_type, event_address, guest_count, meal_type,
    status, categoria, admin_comments, original_timestamp
  ) VALUES (
    'Karine Gragnic',
    'karinegragnic@gmail.com',
    '0676401908',
    '2025-03-23',
    'Anniversaire',
    'ANTIBES ',
    '30-35',
    'null',
    'rejected',
    'null',
    'null',
    '27/02/2025 12:29:01'::timestamp
  );
INSERT INTO external_budgets (
    client_name, client_email, client_phone,
    event_date, event_type, event_address, guest_count, meal_type,
    status, categoria, admin_comments, original_timestamp
  ) VALUES (
    'Marchal Justine ',
    'justinepolo@icloud.com',
    '0669298275',
    '2025-03-16',
    'Anniversaire',
    'La Ciotat ',
    '25',
    'null',
    'rejected',
    'null',
    'null',
    '27/02/2025 14:12:07'::timestamp
  );
INSERT INTO external_budgets (
    client_name, client_email, client_phone,
    event_date, event_type, event_address, guest_count, meal_type,
    status, categoria, admin_comments, original_timestamp
  ) VALUES (
    'Dumas caroline',
    'carolinedumas@wanadoo.fr',
    '0616925032',
    '2025-05-30',
    'Anniversaire',
    '51 chemin de st jean Grasse',
    '60',
    'null',
    'rejected',
    'null',
    'null',
    '27/02/2025 22:10:47'::timestamp
  );
INSERT INTO external_budgets (
    client_name, client_email, client_phone,
    event_date, event_type, event_address, guest_count, meal_type,
    status, categoria, admin_comments, original_timestamp
  ) VALUES (
    'Francoise brigham ',
    'peter.brigham@free.fr',
    '0672147218',
    '2025-04-12',
    'Anniversaire',
    '208 avenue des agaves 06190 roquebrune cap martin',
    '30',
    'null',
    'rejected',
    'null',
    'No estamos',
    '28/02/2025 20:32:23'::timestamp
  );
INSERT INTO external_budgets (
    client_name, client_email, client_phone,
    event_date, event_type, event_address, guest_count, meal_type,
    status, categoria, admin_comments, original_timestamp
  ) VALUES (
    'Calzi Natacha ',
    'natjos@hotmail.com',
    '0684106072',
    '2025-05-30',
    'Anniversaire',
    '55 Route d''Auribeau. 06130 Grasse ',
    '25 adultes et 8 adolescents.',
    'null',
    'rejected',
    'null',
    'null',
    '1/03/2025 10:52:48'::timestamp
  );
INSERT INTO external_budgets (
    client_name, client_email, client_phone,
    event_date, event_type, event_address, guest_count, meal_type,
    status, categoria, admin_comments, original_timestamp
  ) VALUES (
    'Anthony RUGGIU',
    'ruggiu.anthony@gmail.com',
    '0618342028',
    '2025-04-21',
    'Anniversaire',
    '06810 Auribeau sur siagne',
    '30',
    'null',
    'rejected',
    'null',
    'null',
    '1/03/2025 14:48:26'::timestamp
  );
INSERT INTO external_budgets (
    client_name, client_email, client_phone,
    event_date, event_type, event_address, guest_count, meal_type,
    status, categoria, admin_comments, original_timestamp
  ) VALUES (
    'Bodchon Mylène ',
    'mylene.pantera83670@gmail.com',
    '0750421731',
    '2027-07-18',
    'Mariage',
    'Varages ',
    '60',
    'null',
    'rejected',
    'null',
    'null',
    '3/03/2025 13:23:19'::timestamp
  );
INSERT INTO external_budgets (
    client_name, client_email, client_phone,
    event_date, event_type, event_address, guest_count, meal_type,
    status, categoria, admin_comments, original_timestamp
  ) VALUES (
    'Martin Norbert ',
    'norbert.martin2@gmail.com',
    '0605090237',
    '2025-07-05',
    'Anniversaire',
    '59 chemin du Grand Chêne Grasse',
    '30',
    'null',
    'rejected',
    'null',
    'null',
    '3/03/2025 14:31:23'::timestamp
  );
INSERT INTO external_budgets (
    client_name, client_email, client_phone,
    event_date, event_type, event_address, guest_count, meal_type,
    status, categoria, admin_comments, original_timestamp
  ) VALUES (
    'Brocardi nicolas ',
    'nicolasbrocardi@yahoo.com',
    '0619835417',
    '2025-06-08',
    'Anniversaire',
    'Cantaron ',
    '100',
    'null',
    'rejected',
    'null',
    'DESCANSO',
    '3/03/2025 15:06:19'::timestamp
  );
INSERT INTO external_budgets (
    client_name, client_email, client_phone,
    event_date, event_type, event_address, guest_count, meal_type,
    status, categoria, admin_comments, original_timestamp
  ) VALUES (
    'Stephanie pellici',
    'vstephy@free.fr',
    '0613105680',
    '2025-05-09',
    'Anniversaire',
    'LEVENS 06670',
    '30',
    'null',
    'rejected',
    'null',
    'null',
    '4/03/2025 11:47:50'::timestamp
  );
INSERT INTO external_budgets (
    client_name, client_email, client_phone,
    event_date, event_type, event_address, guest_count, meal_type,
    status, categoria, admin_comments, original_timestamp
  ) VALUES (
    'SANDRA FOUGERAS LAVERGNOLLE',
    'sandratestini2012@gmail.com',
    '0621402454',
    '2025-06-14',
    'Anniversaire',
    '12 CHEMIN DE LA COLLE INFERIEURE  06500 MENTON',
    '35',
    'null',
    'rejected',
    'null',
    'No disponibles',
    '5/03/2025 17:31:01'::timestamp
  );
INSERT INTO external_budgets (
    client_name, client_email, client_phone,
    event_date, event_type, event_address, guest_count, meal_type,
    status, categoria, admin_comments, original_timestamp
  ) VALUES (
    'Céline delfino',
    'celinedantzer@hotmail.com',
    '0617256635',
    '2025-07-12',
    'Autre',
    'St Paul de Vence ',
    '25',
    'null',
    'rejected',
    'null',
    'null',
    '5/03/2025 18:05:04'::timestamp
  );
INSERT INTO external_budgets (
    client_name, client_email, client_phone,
    event_date, event_type, event_address, guest_count, meal_type,
    status, categoria, admin_comments, original_timestamp
  ) VALUES (
    'Durand Romain',
    'durand.romain01@gmail.com',
    '0633436998',
    '2025-06-06',
    'Autre',
    'Saint Raphaël',
    '21',
    'null',
    'rejected',
    'null',
    'ver aue onda',
    '6/03/2025 20:30:48'::timestamp
  );
INSERT INTO external_budgets (
    client_name, client_email, client_phone,
    event_date, event_type, event_address, guest_count, meal_type,
    status, categoria, admin_comments, original_timestamp
  ) VALUES (
    'GEORGET Ludovic',
    'ludovic@ljs-plomberie.fr',
    '0626326042',
    '1985-08-17',
    'Anniversaire',
    'Saint raphael 83700',
    '30',
    'null',
    'rejected',
    'null',
    'null',
    '6/03/2025 21:00:32'::timestamp
  );
INSERT INTO external_budgets (
    client_name, client_email, client_phone,
    event_date, event_type, event_address, guest_count, meal_type,
    status, categoria, admin_comments, original_timestamp
  ) VALUES (
    'Delannoy Erwan',
    'delannoy.erwan@gmail.com',
    '0628426336',
    '2025-06-20',
    'Mariage',
    '1173 chemin de notre Dame 06220 golfe juan',
    '22',
    'null',
    'rejected',
    'null',
    'null',
    '7/03/2025 11:13:05'::timestamp
  );
INSERT INTO external_budgets (
    client_name, client_email, client_phone,
    event_date, event_type, event_address, guest_count, meal_type,
    status, categoria, admin_comments, original_timestamp
  ) VALUES (
    'Lafforgue Lydia',
    'lydia.lafforgue@gmail.com',
    '0616987647',
    '2025-05-11',
    'Anniversaire',
    '3256 bis chemin du malvan',
    '35',
    'null',
    'rejected',
    'null',
    'null',
    '9/03/2025 18:05:06'::timestamp
  );
INSERT INTO external_budgets (
    client_name, client_email, client_phone,
    event_date, event_type, event_address, guest_count, meal_type,
    status, categoria, admin_comments, original_timestamp
  ) VALUES (
    'Anthony Ginet',
    'ginet.anthony@yahoo.com',
    '0666921531',
    '2025-05-03',
    'Anniversaire',
    'Le Bellambra à la colle sur loup',
    '40 personnes',
    'null',
    'rejected',
    'null',
    'ESPERAR',
    '9/03/2025 19:23:01'::timestamp
  );
INSERT INTO external_budgets (
    client_name, client_email, client_phone,
    event_date, event_type, event_address, guest_count, meal_type,
    status, categoria, admin_comments, original_timestamp
  ) VALUES (
    'Miguel Tatiana ',
    'titou__06@hotmail.com',
    '0760592141',
    '2026-06-20',
    'Mariage',
    'Sospel',
    '110',
    'null',
    'rejected',
    'null',
    'ESPERAR',
    '10/03/2025 20:04:18'::timestamp
  );
INSERT INTO external_budgets (
    client_name, client_email, client_phone,
    event_date, event_type, event_address, guest_count, meal_type,
    status, categoria, admin_comments, original_timestamp
  ) VALUES (
    'TOULLALAN Josephine',
    'lutringer.jo@gmail.com',
    '0677005401',
    '2025-05-10',
    'Anniversaire',
    'Impasse de la Carraire à Mougins',
    'Entre 20 et 30 personnes',
    'null',
    'rejected',
    'null',
    'null',
    '10/03/2025 21:18:18'::timestamp
  );
INSERT INTO external_budgets (
    client_name, client_email, client_phone,
    event_date, event_type, event_address, guest_count, meal_type,
    status, categoria, admin_comments, original_timestamp
  ) VALUES (
    'Javier Cabral ',
    'fjcabral89@gmail.com',
    '+33787958920',
    '2025-06-21',
    'Mariage',
    '18 Rue Fragonard, 06800 Cagnes-sur-Mer, France',
    '25',
    'null',
    'rejected',
    'null',
    'NO DISPOS',
    '11/03/2025 3:12:43'::timestamp
  );
INSERT INTO external_budgets (
    client_name, client_email, client_phone,
    event_date, event_type, event_address, guest_count, meal_type,
    status, categoria, admin_comments, original_timestamp
  ) VALUES (
    'JANER Giulia ',
    'giuliajaner@gmail.com',
    '0781495994',
    '2025-05-31',
    'Anniversaire',
    '682 Boulevard du Mercantour ',
    '38',
    'null',
    'rejected',
    'null',
    'null',
    '12/03/2025 0:08:35'::timestamp
  );
INSERT INTO external_budgets (
    client_name, client_email, client_phone,
    event_date, event_type, event_address, guest_count, meal_type,
    status, categoria, admin_comments, original_timestamp
  ) VALUES (
    'Bornaes Julie',
    'juliebornaes@outlook.fr',
    '0628784840',
    '2025-03-29',
    'Anniversaire',
    '6 Chemin du Collet de la Croix',
    '20',
    'null',
    'rejected',
    'null',
    'Agustin',
    '12/03/2025 10:58:31'::timestamp
  );
INSERT INTO external_budgets (
    client_name, client_email, client_phone,
    event_date, event_type, event_address, guest_count, meal_type,
    status, categoria, admin_comments, original_timestamp
  ) VALUES (
    'Lefevre Olivia ',
    'lefevreolivia31@gmail.com',
    '0768350213',
    '2025-08-09',
    'Baptême',
    'Salle de contes 06390',
    '50',
    'null',
    'rejected',
    'null',
    'null',
    '13/03/2025 8:18:38'::timestamp
  );
INSERT INTO external_budgets (
    client_name, client_email, client_phone,
    event_date, event_type, event_address, guest_count, meal_type,
    status, categoria, admin_comments, original_timestamp
  ) VALUES (
    'veronique alunni',
    'vap1968@yahoo.fr',
    '0612550583',
    '2025-07-06',
    'Autre',
    'nice',
    '20',
    'null',
    'rejected',
    'null',
    'null',
    '14/03/2025 17:02:30'::timestamp
  );
INSERT INTO external_budgets (
    client_name, client_email, client_phone,
    event_date, event_type, event_address, guest_count, meal_type,
    status, categoria, admin_comments, original_timestamp
  ) VALUES (
    'Pauline Coinon',
    'pauline.coinon@gmail.com',
    '0661342770',
    '2025-05-26',
    'Autre',
    'Saint- Raphaël ',
    '12',
    'null',
    'rejected',
    'null',
    'Gales',
    '15/03/2025 8:46:30'::timestamp
  );
INSERT INTO external_budgets (
    client_name, client_email, client_phone,
    event_date, event_type, event_address, guest_count, meal_type,
    status, categoria, admin_comments, original_timestamp
  ) VALUES (
    'Giordano Killian ',
    'killian.giordano@yahoo.fr',
    '0623212915',
    '2025-05-02',
    'Mariage',
    '164, Route de l''Authion 06440 LUCERAM',
    '80',
    'null',
    'rejected',
    'null',
    'null',
    '15/03/2025 19:12:26'::timestamp
  );
INSERT INTO external_budgets (
    client_name, client_email, client_phone,
    event_date, event_type, event_address, guest_count, meal_type,
    status, categoria, admin_comments, original_timestamp
  ) VALUES (
    'Bordes Elodie ',
    'bertrand.elodie06@gmail.com',
    '0646471629',
    '2025-06-14',
    'Anniversaire',
    'La gaude ',
    '30',
    'null',
    'rejected',
    'null',
    'Ya hay 2 ese dia',
    '16/03/2025 11:16:40'::timestamp
  );
INSERT INTO external_budgets (
    client_name, client_email, client_phone,
    event_date, event_type, event_address, guest_count, meal_type,
    status, categoria, admin_comments, original_timestamp
  ) VALUES (
    'Laurent Brando',
    'laurent.brando@gmail.com',
    '0786860571',
    '2025-05-10',
    'Anniversaire',
    '118 route de pegomas 06130 Grasse',
    '28',
    'null',
    'accepted',
    'null',
    'null',
    '18/03/2025 10:21:12'::timestamp
  );
INSERT INTO external_budgets (
    client_name, client_email, client_phone,
    event_date, event_type, event_address, guest_count, meal_type,
    status, categoria, admin_comments, original_timestamp
  ) VALUES (
    'Caroline Delfosse',
    'caroline.delfosse03@gmail.com',
    '0675343619',
    '2025-05-04',
    'Anniversaire',
    'Le trayas ',
    '40',
    'null',
    'accepted',
    'null',
    'null',
    '18/03/2025 22:14:26'::timestamp
  );
INSERT INTO external_budgets (
    client_name, client_email, client_phone,
    event_date, event_type, event_address, guest_count, meal_type,
    status, categoria, admin_comments, original_timestamp
  ) VALUES (
    'Coli Alexandra',
    'alexandra.coli@hotmail.fr',
    '0616394760',
    '2025-06-28',
    'Anniversaire',
    'Chemin Du Touar 06330 Roquefort les pins ',
    '40',
    'null',
    'rejected',
    'null',
    'null',
    '19/03/2025 20:37:02'::timestamp
  );
INSERT INTO external_budgets (
    client_name, client_email, client_phone,
    event_date, event_type, event_address, guest_count, meal_type,
    status, categoria, admin_comments, original_timestamp
  ) VALUES (
    'Virginie Misale ',
    'virginiemisale@yahoo.fr',
    '0646242880',
    '2025-06-27',
    'Anniversaire',
    'Blausasc ',
    '50',
    'null',
    'rejected',
    'null',
    'Duplicado',
    '21/03/2025 12:57:53'::timestamp
  );
INSERT INTO external_budgets (
    client_name, client_email, client_phone,
    event_date, event_type, event_address, guest_count, meal_type,
    status, categoria, admin_comments, original_timestamp
  ) VALUES (
    'SERRES Julie',
    'serresjulie@yahoo.Fr',
    '0675588938',
    '2025-05-03',
    'Anniversaire',
    '8 chemin du collet 06650 Opio',
    '25',
    'null',
    'rejected',
    'null',
    'null',
    '21/03/2025 16:11:06'::timestamp
  );
INSERT INTO external_budgets (
    client_name, client_email, client_phone,
    event_date, event_type, event_address, guest_count, meal_type,
    status, categoria, admin_comments, original_timestamp
  ) VALUES (
    'Virginie Misale ',
    'virginiemisale@yahoo.fr',
    '0646242880',
    '2025-06-27',
    'Anniversaire',
    'Blausasc ',
    '50',
    'null',
    'rejected',
    'null',
    'nada ese finde',
    '21/03/2025 17:39:56'::timestamp
  );
INSERT INTO external_budgets (
    client_name, client_email, client_phone,
    event_date, event_type, event_address, guest_count, meal_type,
    status, categoria, admin_comments, original_timestamp
  ) VALUES (
    'Favresse Sophie ',
    'sophie.favresse01@gmail.com',
    '0621343811',
    '1975-08-08',
    'Anniversaire',
    'Mouans Sartoux',
    '40',
    'null',
    'accepted',
    'null',
    'null',
    '22/03/2025 10:19:28'::timestamp
  );
INSERT INTO external_budgets (
    client_name, client_email, client_phone,
    event_date, event_type, event_address, guest_count, meal_type,
    status, categoria, admin_comments, original_timestamp
  ) VALUES (
    'Natacha Roux',
    'nat_roux06@hotmail.com',
    '0629980972',
    '2025-05-18',
    'Baptême',
    '248 promenade Albert camus',
    '35',
    'null',
    'rejected',
    'null',
    'null',
    '22/03/2025 17:32:54'::timestamp
  );
INSERT INTO external_budgets (
    client_name, client_email, client_phone,
    event_date, event_type, event_address, guest_count, meal_type,
    status, categoria, admin_comments, original_timestamp
  ) VALUES (
    'Laura Malaval ',
    'lauramalaval1@gmail.com',
    '0619991173',
    '2026-06-13',
    'Baptême',
    '30 Boulevard Beau Rivage, Villa Mon Caprice',
    '40',
    'null',
    'rejected',
    'null',
    'null',
    '23/03/2025 9:50:40'::timestamp
  );
INSERT INTO external_budgets (
    client_name, client_email, client_phone,
    event_date, event_type, event_address, guest_count, meal_type,
    status, categoria, admin_comments, original_timestamp
  ) VALUES (
    'Bruno Marjorie ',
    'bruno.marjorie06@gmail.com',
    '0684768985',
    '2025-09-13',
    'Baptême',
    'Chemin de la cerisaie à Mougins 06250',
    '80',
    'null',
    'accepted',
    'null',
    'null',
    '24/03/2025 20:01:37'::timestamp
  );
INSERT INTO external_budgets (
    client_name, client_email, client_phone,
    event_date, event_type, event_address, guest_count, meal_type,
    status, categoria, admin_comments, original_timestamp
  ) VALUES (
    'Pouil tiffany ',
    'Pouiltiffany@gmail.com',
    '0782324515',
    '2026-06-13',
    'Mariage',
    'Greolieres',
    '150',
    'null',
    'rejected',
    'null',
    'null',
    '25/03/2025 15:28:30'::timestamp
  );
INSERT INTO external_budgets (
    client_name, client_email, client_phone,
    event_date, event_type, event_address, guest_count, meal_type,
    status, categoria, admin_comments, original_timestamp
  ) VALUES (
    'Kevin aubert',
    'kevin.aub@outlook.fr',
    '0634105527',
    '2025-07-26',
    'Mariage',
    '445 ancien chemin de St Paul -06140 vence',
    '80',
    'null',
    'rejected',
    'null',
    'nada ese finde',
    '26/03/2025 13:16:22'::timestamp
  );
INSERT INTO external_budgets (
    client_name, client_email, client_phone,
    event_date, event_type, event_address, guest_count, meal_type,
    status, categoria, admin_comments, original_timestamp
  ) VALUES (
    'Floriane BERTHET ',
    'floriane.berthet@gmail.com',
    '0674707188',
    '2025-08-03',
    'Baptême',
    '06140',
    '25',
    'null',
    'rejected',
    'null',
    'Duplicaod',
    '26/03/2025 20:58:45'::timestamp
  );
INSERT INTO external_budgets (
    client_name, client_email, client_phone,
    event_date, event_type, event_address, guest_count, meal_type,
    status, categoria, admin_comments, original_timestamp
  ) VALUES (
    'Fostine Grzelakowski',
    'fostine@roads.social',
    '0763469441',
    '2025-04-25',
    'Corporatif',
    'Nice',
    '25',
    'null',
    'rejected',
    'null',
    'null',
    '27/03/2025 17:09:22'::timestamp
  );
INSERT INTO external_budgets (
    client_name, client_email, client_phone,
    event_date, event_type, event_address, guest_count, meal_type,
    status, categoria, admin_comments, original_timestamp
  ) VALUES (
    'Pierre Dumas ',
    'dolfus@gmx.com',
    '0769699292',
    '2025-06-28',
    'Baptême',
    '128 Square Du Golf Mougins ',
    '35',
    'null',
    'rejected',
    'null',
    'No dispos',
    '29/03/2025 8:30:04'::timestamp
  );
INSERT INTO external_budgets (
    client_name, client_email, client_phone,
    event_date, event_type, event_address, guest_count, meal_type,
    status, categoria, admin_comments, original_timestamp
  ) VALUES (
    'Siegfried portes ',
    'sieg.portes@icloud.com',
    '0616950793',
    '2026-06-09',
    'Mariage',
    'La seyne sur mer ',
    '60',
    'null',
    'rejected',
    'null',
    'Lejos',
    '29/03/2025 14:00:02'::timestamp
  );
INSERT INTO external_budgets (
    client_name, client_email, client_phone,
    event_date, event_type, event_address, guest_count, meal_type,
    status, categoria, admin_comments, original_timestamp
  ) VALUES (
    'Carole Rembert ',
    'carole.rembert@hotmail.com',
    '0674898547',
    '2025-08-02',
    'Autre',
    'Nice ',
    '30',
    'null',
    'rejected',
    'null',
    'No dispos',
    '29/03/2025 15:54:40'::timestamp
  );
INSERT INTO external_budgets (
    client_name, client_email, client_phone,
    event_date, event_type, event_address, guest_count, meal_type,
    status, categoria, admin_comments, original_timestamp
  ) VALUES (
    'Floriane ZANET',
    'floriane.berthet@gmail.com',
    '0674707188',
    '2025-08-04',
    'Baptême',
    'Vence ',
    '25',
    'null',
    'accepted',
    'null',
    'null',
    '29/03/2025 18:02:31'::timestamp
  );
INSERT INTO external_budgets (
    client_name, client_email, client_phone,
    event_date, event_type, event_address, guest_count, meal_type,
    status, categoria, admin_comments, original_timestamp
  ) VALUES (
    'Baudet Stéphanie ',
    'sbaudet@quantificare.com',
    '0627093264',
    '2025-07-02',
    'Corporatif',
    '980 avenue de Roumanille, 06410 Biot ',
    '80',
    'null',
    'rejected',
    'null',
    'LLAMAR LUNES',
    '29/03/2025 20:53:09'::timestamp
  );
INSERT INTO external_budgets (
    client_name, client_email, client_phone,
    event_date, event_type, event_address, guest_count, meal_type,
    status, categoria, admin_comments, original_timestamp
  ) VALUES (
    'HERVE yannick',
    'y.herve@hrc-nice.fr',
    '0664438732',
    '2025-05-17',
    'Anniversaire',
    '318 corniche de magnan 06000 NICE',
    '22',
    'null',
    'accepted',
    'null',
    'null',
    '30/03/2025 16:07:01'::timestamp
  );
INSERT INTO external_budgets (
    client_name, client_email, client_phone,
    event_date, event_type, event_address, guest_count, meal_type,
    status, categoria, admin_comments, original_timestamp
  ) VALUES (
    'VELOT JEAN -MARC',
    'jeanmarcvelot@gmail.com',
    '0778470806',
    '2026-05-09',
    'Anniversaire',
    'Indéterminée pour l''instant ',
    'Environ 40 au total dont 8 enfants ',
    'null',
    'accepted',
    'null',
    'null',
    '1/04/2025 20:12:02'::timestamp
  );
INSERT INTO external_budgets (
    client_name, client_email, client_phone,
    event_date, event_type, event_address, guest_count, meal_type,
    status, categoria, admin_comments, original_timestamp
  ) VALUES (
    'BALDACCHINO NATHALIE ',
    'nbaldacchino@ports-monaco.com',
    '+37797773012',
    '2025-04-24',
    'Corporatif',
    'DIGUE RAINIER III, MONACO ',
    '200',
    'null',
    'accepted',
    'null',
    'null',
    '2/04/2025 11:32:24'::timestamp
  );
INSERT INTO external_budgets (
    client_name, client_email, client_phone,
    event_date, event_type, event_address, guest_count, meal_type,
    status, categoria, admin_comments, original_timestamp
  ) VALUES (
    'dule elvis ',
    'elvisdule@gmail.com',
    '0668798974',
    '2025-09-20',
    'Mariage',
    'saint paul de vence chemin du cercle ',
    '40',
    'null',
    'rejected',
    'null',
    'ESPERAR',
    '2/04/2025 14:36:26'::timestamp
  );
INSERT INTO external_budgets (
    client_name, client_email, client_phone,
    event_date, event_type, event_address, guest_count, meal_type,
    status, categoria, admin_comments, original_timestamp
  ) VALUES (
    'MOLINENGO GAEL',
    'g.molinengo@gmail.com',
    '0612089722',
    '2025-09-27',
    'Anniversaire',
    'Mougins',
    '150',
    'null',
    'rejected',
    'null',
    'null',
    '2/04/2025 15:20:05'::timestamp
  );
INSERT INTO external_budgets (
    client_name, client_email, client_phone,
    event_date, event_type, event_address, guest_count, meal_type,
    status, categoria, admin_comments, original_timestamp
  ) VALUES (
    'KLETKE Coline ICONE WEDDING',
    'coline.kletke@iconewedding.com',
    '0645631280',
    '2026-06-26',
    'Mariage',
    'ROQUEBRUNE CAP MARTIN',
    '80',
    'null',
    'rejected',
    'null',
    '2026',
    '3/04/2025 12:07:11'::timestamp
  );
INSERT INTO external_budgets (
    client_name, client_email, client_phone,
    event_date, event_type, event_address, guest_count, meal_type,
    status, categoria, admin_comments, original_timestamp
  ) VALUES (
    'Julie Duong',
    'yannicketjulielecorre@gmail.com',
    '0618901787',
    '2026-06-13',
    'Mariage',
    '302 D9 Sannes 84240',
    '90',
    'null',
    'rejected',
    'null',
    '2026',
    '4/04/2025 20:11:04'::timestamp
  );
INSERT INTO external_budgets (
    client_name, client_email, client_phone,
    event_date, event_type, event_address, guest_count, meal_type,
    status, categoria, admin_comments, original_timestamp
  ) VALUES (
    'Lionel Friedmann',
    'drfriedmann@thedentalchambers.com',
    '+447943078635',
    '2025-05-31',
    'Anniversaire',
    'Saint Paul de vence ',
    '45',
    'null',
    'accepted',
    'null',
    'null',
    '5/04/2025 10:14:31'::timestamp
  );
INSERT INTO external_budgets (
    client_name, client_email, client_phone,
    event_date, event_type, event_address, guest_count, meal_type,
    status, categoria, admin_comments, original_timestamp
  ) VALUES (
    'Marjorie',
    'marjorieha@hotmail.fr',
    '672944272',
    '2025-05-17',
    'Anniversaire',
    '377 Route De Nice 06320 La Turbie ',
    '25/30',
    'null',
    'accepted',
    'null',
    'null',
    '5/04/2025 13:44:04'::timestamp
  );
INSERT INTO external_budgets (
    client_name, client_email, client_phone,
    event_date, event_type, event_address, guest_count, meal_type,
    status, categoria, admin_comments, original_timestamp
  ) VALUES (
    'BLAY Mike ',
    'blaymike1@gmail.com',
    '0767626648',
    '2025-07-05',
    'Anniversaire',
    '9009 Chemin De Rosemont 06100 Nice',
    '40',
    'null',
    'rejected',
    'null',
    'null',
    '5/04/2025 15:29:51'::timestamp
  );
INSERT INTO external_budgets (
    client_name, client_email, client_phone,
    event_date, event_type, event_address, guest_count, meal_type,
    status, categoria, admin_comments, original_timestamp
  ) VALUES (
    'Julie liprandi',
    'contenti.j@chu-nice.fr',
    '0647719863',
    '2025-04-12',
    'Anniversaire',
    '737 chemin des brusquets',
    '13 adultes + 2 enfants ',
    'null',
    'rejected',
    'null',
    'No dispos',
    '6/04/2025 15:06:20'::timestamp
  );
INSERT INTO external_budgets (
    client_name, client_email, client_phone,
    event_date, event_type, event_address, guest_count, meal_type,
    status, categoria, admin_comments, original_timestamp
  ) VALUES (
    'Ricordi laurent',
    'laurent@tamarins-dvlp.eu',
    '0786047880',
    '2025-06-05',
    'Corporatif',
    '12 avenue des Arlucs cannes la bocca',
    '60',
    'null',
    'rejected',
    'null',
    'ESPERAR',
    '7/04/2025 11:17:03'::timestamp
  );
INSERT INTO external_budgets (
    client_name, client_email, client_phone,
    event_date, event_type, event_address, guest_count, meal_type,
    status, categoria, admin_comments, original_timestamp
  ) VALUES (
    'Coralie Michard',
    'communication@sev-jardins.com',
    '0675119737',
    '2025-08-01',
    'Corporatif',
    '125 Chemin des Prés, 06410 Biot',
    '90',
    'null',
    'rejected',
    'null',
    'Fecha de kermesse',
    '9/04/2025 10:12:31'::timestamp
  );
INSERT INTO external_budgets (
    client_name, client_email, client_phone,
    event_date, event_type, event_address, guest_count, meal_type,
    status, categoria, admin_comments, original_timestamp
  ) VALUES (
    'Benassouli Déborah ',
    'deborahbenassouli@icloud.com',
    '0661052539',
    '2025-06-14',
    'Autre',
    'La garde-freinet',
    '14',
    'null',
    'rejected',
    'null',
    'No dispos',
    '9/04/2025 10:19:27'::timestamp
  );
INSERT INTO external_budgets (
    client_name, client_email, client_phone,
    event_date, event_type, event_address, guest_count, meal_type,
    status, categoria, admin_comments, original_timestamp
  ) VALUES (
    'Boldrini Alexandra',
    'alexandra.boldrini@yahoo.fr',
    '0679235632',
    '2025-05-01',
    'Anniversaire',
    '45 chemin de la bordina 06320 la turbie ',
    '15',
    'null',
    'rejected',
    'null',
    'null',
    '10/04/2025 11:24:12'::timestamp
  );
INSERT INTO external_budgets (
    client_name, client_email, client_phone,
    event_date, event_type, event_address, guest_count, meal_type,
    status, categoria, admin_comments, original_timestamp
  ) VALUES (
    'Mireille Ruttens',
    'ruttensmireille@gmail.com',
    '0650939334',
    '2025-08-16',
    'Mariage',
    '500 Avenue de Thorenc, 06750 Andon',
    '80',
    'null',
    'accepted',
    'null',
    'null',
    '11/04/2025 8:57:43'::timestamp
  );
INSERT INTO external_budgets (
    client_name, client_email, client_phone,
    event_date, event_type, event_address, guest_count, meal_type,
    status, categoria, admin_comments, original_timestamp
  ) VALUES (
    'Élodie gorski',
    'elodie.gorski@gmail.com',
    '0620685970',
    '2025-07-05',
    'Baptême',
    '36 BIS CHEMIN ALPHONSE DAUDET 06800 cagnes sur mer',
    '40 environ',
    'null',
    'rejected',
    'null',
    'null',
    '13/04/2025 16:08:25'::timestamp
  );
INSERT INTO external_budgets (
    client_name, client_email, client_phone,
    event_date, event_type, event_address, guest_count, meal_type,
    status, categoria, admin_comments, original_timestamp
  ) VALUES (
    'GARGULA Patrick',
    'patrick.gargula@gmail.com',
    '0624763287',
    '2025-08-30',
    'Anniversaire',
    '4 avenue Saint Jacques 06200 NICE',
    '50',
    'null',
    'accepted',
    'null',
    'null',
    '14/04/2025 23:12:44'::timestamp
  );
INSERT INTO external_budgets (
    client_name, client_email, client_phone,
    event_date, event_type, event_address, guest_count, meal_type,
    status, categoria, admin_comments, original_timestamp
  ) VALUES (
    'DEGIOVANNI NICOLAS ',
    'nccle@hotmail.fr',
    '0611555943',
    '2025-05-03',
    'Anniversaire',
    '1263 RUE ANTOINE PEGLION 06190 ROQUEBRUNE CAP MARTIN',
    '55',
    'null',
    'rejected',
    'null',
    'null',
    '15/04/2025 8:57:34'::timestamp
  );
INSERT INTO external_budgets (
    client_name, client_email, client_phone,
    event_date, event_type, event_address, guest_count, meal_type,
    status, categoria, admin_comments, original_timestamp
  ) VALUES (
    'Charlotte Dupuis',
    'charlotte@dupuis.eu',
    '+32477908844',
    '2025-06-25',
    'Anniversaire',
    'Château Lagarde, 83830 Figanieres',
    '14',
    'null',
    'rejected',
    'null',
    'null',
    '15/04/2025 14:06:08'::timestamp
  );
INSERT INTO external_budgets (
    client_name, client_email, client_phone,
    event_date, event_type, event_address, guest_count, meal_type,
    status, categoria, admin_comments, original_timestamp
  ) VALUES (
    'maxime',
    'contact@decapmax.fr',
    '0663976000',
    '2025-07-31',
    'Corporatif',
    'ludipark la colle sur loup',
    '45',
    'null',
    'rejected',
    'null',
    'esperar kermess',
    '15/04/2025 17:49:27'::timestamp
  );
INSERT INTO external_budgets (
    client_name, client_email, client_phone,
    event_date, event_type, event_address, guest_count, meal_type,
    status, categoria, admin_comments, original_timestamp
  ) VALUES (
    'BRAND CHRIS',
    'chris.brand@sfr.fr',
    '0668211610',
    '2025-05-17',
    'Anniversaire',
    'Chemin de Rabiac Estagnol',
    '16',
    'null',
    'rejected',
    'null',
    'No dispos',
    '16/04/2025 11:54:50'::timestamp
  );
INSERT INTO external_budgets (
    client_name, client_email, client_phone,
    event_date, event_type, event_address, guest_count, meal_type,
    status, categoria, admin_comments, original_timestamp
  ) VALUES (
    'Octavia Killian',
    'octavia.killian@iscod.fr',
    '0698580078',
    '2025-06-17',
    'Corporatif',
    '950 route des colles 06410 Biot',
    '140',
    'null',
    'rejected',
    'null',
    'null',
    '16/04/2025 13:09:33'::timestamp
  );
INSERT INTO external_budgets (
    client_name, client_email, client_phone,
    event_date, event_type, event_address, guest_count, meal_type,
    status, categoria, admin_comments, original_timestamp
  ) VALUES (
    'Lana Jardine',
    'lana.g.d.jardien@gmail.com',
    '+33782740303',
    '2026-04-26',
    'Autre',
    'Port Gallice ',
    'Environ 70',
    'null',
    'pending',
    'null',
    'null',
    '18/04/2025 12:36:36'::timestamp
  );
INSERT INTO external_budgets (
    client_name, client_email, client_phone,
    event_date, event_type, event_address, guest_count, meal_type,
    status, categoria, admin_comments, original_timestamp
  ) VALUES (
    'Martinez robin',
    'robinmartinez74@gmail.com',
    '0673081021',
    '2025-07-12',
    'Autre',
    '200 rue de l''école ',
    '45',
    'null',
    'pending',
    'null',
    'null',
    '21/04/2025 10:57:02'::timestamp
  );
INSERT INTO external_budgets (
    client_name, client_email, client_phone,
    event_date, event_type, event_address, guest_count, meal_type,
    status, categoria, admin_comments, original_timestamp
  ) VALUES (
    'Audrey Perez',
    'perez_audrey@ymail.com',
    '0613427144',
    '2026-07-19',
    'Mariage',
    'Bras 83149',
    '20',
    'null',
    'rejected',
    'null',
    'null',
    '22/04/2025 21:50:50'::timestamp
  );
INSERT INTO external_budgets (
    client_name, client_email, client_phone,
    event_date, event_type, event_address, guest_count, meal_type,
    status, categoria, admin_comments, original_timestamp
  ) VALUES (
    'Roumiermaxime',
    'contact@decapmax.fr',
    '0663976000',
    '2025-07-31',
    'Corporatif',
    'LA COLLE SUR LOUP',
    '50',
    'null',
    'pending',
    'null',
    'null',
    '23/04/2025 18:08:09'::timestamp
  );
INSERT INTO external_budgets (
    client_name, client_email, client_phone,
    event_date, event_type, event_address, guest_count, meal_type,
    status, categoria, admin_comments, original_timestamp
  ) VALUES (
    'Roth Michaël',
    'jmo.roth@outlook.com',
    '0680744775',
    '2025-06-22',
    'Baptême',
    '2 avenue du plateau du Mont Boron',
    '25',
    'null',
    'rejected',
    'null',
    'null',
    '23/04/2025 19:22:14'::timestamp
  );
INSERT INTO external_budgets (
    client_name, client_email, client_phone,
    event_date, event_type, event_address, guest_count, meal_type,
    status, categoria, admin_comments, original_timestamp
  ) VALUES (
    'Faes frederic',
    'faes.frederic@gmail.com',
    '0699630358',
    '2025-05-31',
    'Anniversaire',
    'Nice 06200',
    '12',
    'null',
    'rejected',
    'null',
    'grupo chico',
    '25/04/2025 23:08:35'::timestamp
  );
INSERT INTO external_budgets (
    client_name, client_email, client_phone,
    event_date, event_type, event_address, guest_count, meal_type,
    status, categoria, admin_comments, original_timestamp
  ) VALUES (
    'Biancheri Quesnel Mélanie ',
    'biancherimelanie@gmail.com',
    '0642178680',
    '2025-06-22',
    'Anniversaire',
    '112 A via peidaigo ventimiglia',
    '30 adultes 15 enfants ',
    'null',
    'rejected',
    'null',
    'null',
    '26/04/2025 15:55:40'::timestamp
  );
INSERT INTO external_budgets (
    client_name, client_email, client_phone,
    event_date, event_type, event_address, guest_count, meal_type,
    status, categoria, admin_comments, original_timestamp
  ) VALUES (
    'Templier Séverine ',
    'sev.templier@gmail.com',
    '0766219059',
    '2025-07-05',
    'Mariage',
    '106 impasse des aubépines 06650 le Rouret ',
    '25',
    'null',
    'rejected',
    'null',
    'null',
    '30/04/2025 21:59:22'::timestamp
  );
INSERT INTO external_budgets (
    client_name, client_email, client_phone,
    event_date, event_type, event_address, guest_count, meal_type,
    status, categoria, admin_comments, original_timestamp
  ) VALUES (
    'Rosenthal Pereira Lima ',
    'marinarpl@gmail.com',
    '0626105660',
    '2025-09-20',
    'Autre',
    'Av Saint Thècle - Nice ',
    '50',
    'null',
    'rejected',
    'null',
    'null',
    '1/05/2025 11:24:22'::timestamp
  );
INSERT INTO external_budgets (
    client_name, client_email, client_phone,
    event_date, event_type, event_address, guest_count, meal_type,
    status, categoria, admin_comments, original_timestamp
  ) VALUES (
    'Victor Medard de Chardon',
    'v.mdc@mac.com',
    '0601055076',
    '2025-05-18',
    'Anniversaire',
    '3 Avenue Therese , Villa Noor',
    '12',
    'null',
    'accepted',
    'null',
    'null',
    '2/05/2025 12:02:01'::timestamp
  );
INSERT INTO external_budgets (
    client_name, client_email, client_phone,
    event_date, event_type, event_address, guest_count, meal_type,
    status, categoria, admin_comments, original_timestamp
  ) VALUES (
    'Jenna Tounsi',
    'tounsi.jenna@gmail.com',
    '0608829798',
    '2025-09-14',
    'Autre',
    'Roquefort les pins',
    '50 à 70 ',
    'null',
    'accepted',
    'null',
    'null',
    '2/05/2025 13:13:13'::timestamp
  );
INSERT INTO external_budgets (
    client_name, client_email, client_phone,
    event_date, event_type, event_address, guest_count, meal_type,
    status, categoria, admin_comments, original_timestamp
  ) VALUES (
    'VIVES Aurélien',
    'va.vivesaurelien@gmail.com',
    '0650837757',
    '2026-06-20',
    'Mariage',
    'Domaine Nestuby, 4540 Rte de Montfort, Cotignac, 83046',
    '70',
    'null',
    'rejected',
    'null',
    '2026',
    '4/05/2025 13:25:07'::timestamp
  );
INSERT INTO external_budgets (
    client_name, client_email, client_phone,
    event_date, event_type, event_address, guest_count, meal_type,
    status, categoria, admin_comments, original_timestamp
  ) VALUES (
    'Elena jessica ',
    'theoemmy09@gmail.com',
    '0621291442',
    '2026-10-24',
    'Mariage',
    'La palud sur verdon 04120 ',
    '30',
    'null',
    'rejected',
    'null',
    '2026',
    '4/05/2025 20:01:38'::timestamp
  );
INSERT INTO external_budgets (
    client_name, client_email, client_phone,
    event_date, event_type, event_address, guest_count, meal_type,
    status, categoria, admin_comments, original_timestamp
  ) VALUES (
    'Fattorini Yannick',
    'yannick.fattorini@nicecotedazur.org',
    '0645113142',
    '2025-05-29',
    'Corporatif',
    'Port de Nice Quai du Commerce',
    '30',
    'null',
    'rejected',
    'null',
    'null',
    '5/05/2025 9:22:03'::timestamp
  );
INSERT INTO external_budgets (
    client_name, client_email, client_phone,
    event_date, event_type, event_address, guest_count, meal_type,
    status, categoria, admin_comments, original_timestamp
  ) VALUES (
    'EL KHOURY Rony',
    'docrony@gmail.com',
    '0610260818',
    '2025-07-13',
    'Anniversaire',
    'Saint Laurent du Var',
    '25-40',
    'null',
    'accepted',
    'null',
    'null',
    '5/05/2025 10:44:38'::timestamp
  );
INSERT INTO external_budgets (
    client_name, client_email, client_phone,
    event_date, event_type, event_address, guest_count, meal_type,
    status, categoria, admin_comments, original_timestamp
  ) VALUES (
    'CASTRO David',
    'david.castro@energitec.fr',
    '0625450211',
    '2025-06-13',
    'Autre',
    '260 Rue Lavoisier 83078 Toulon',
    '15',
    'null',
    'rejected',
    'null',
    'null',
    '5/05/2025 17:28:05'::timestamp
  );
INSERT INTO external_budgets (
    client_name, client_email, client_phone,
    event_date, event_type, event_address, guest_count, meal_type,
    status, categoria, admin_comments, original_timestamp
  ) VALUES (
    'ERMEL-PALLA STEPHANIE',
    's.ermel-palla@sncpetra.com',
    '0664963219',
    '2025-05-23',
    'Anniversaire',
    '135 route saint pierre de féric, nice',
    '11',
    'null',
    'rejected',
    'null',
    'null',
    '5/05/2025 18:51:54'::timestamp
  );
INSERT INTO external_budgets (
    client_name, client_email, client_phone,
    event_date, event_type, event_address, guest_count, meal_type,
    status, categoria, admin_comments, original_timestamp
  ) VALUES (
    'Pasquet Margot ',
    'margot.pasquet@live.fr',
    '06 59 28 65 90 ',
    '2026-07-18',
    'Mariage',
    'La londe les maures, 83250',
    '40/45 personnes',
    'null',
    'rejected',
    'null',
    'null',
    '5/05/2025 21:03:22'::timestamp
  );
INSERT INTO external_budgets (
    client_name, client_email, client_phone,
    event_date, event_type, event_address, guest_count, meal_type,
    status, categoria, admin_comments, original_timestamp
  ) VALUES (
    'Donadey Stephanie ',
    'stephaniedonadey@gmail.com',
    '0665528944',
    '2025-07-05',
    'Anniversaire',
    '171 Route Du Col',
    '20 à 22',
    'null',
    'rejected',
    'null',
    'null',
    '6/05/2025 10:39:30'::timestamp
  );
INSERT INTO external_budgets (
    client_name, client_email, client_phone,
    event_date, event_type, event_address, guest_count, meal_type,
    status, categoria, admin_comments, original_timestamp
  ) VALUES (
    'Fantino Stephan ',
    'fantinostephan@gmail.com',
    '0660773621',
    '2025-07-12',
    'Autre',
    '126 chemin du château d eau 06390 berre les Alpes ',
    '60',
    'null',
    'rejected',
    'null',
    'null',
    '6/05/2025 12:19:27'::timestamp
  );
INSERT INTO external_budgets (
    client_name, client_email, client_phone,
    event_date, event_type, event_address, guest_count, meal_type,
    status, categoria, admin_comments, original_timestamp
  ) VALUES (
    'Charlotte OLIVIER (Evenementia',
    'evenementia.contact@gmail.com',
    '07 89 58 42 01',
    '2025-07-13',
    'Autre',
    'Berre les alpes (pas encore l''adresse exacte)',
    '60',
    'null',
    'rejected',
    'null',
    'No dispos',
    '6/05/2025 14:24:34'::timestamp
  );
INSERT INTO external_budgets (
    client_name, client_email, client_phone,
    event_date, event_type, event_address, guest_count, meal_type,
    status, categoria, admin_comments, original_timestamp
  ) VALUES (
    'Michael Skrobacki',
    'mskrobacki@groupe-atlantic.com',
    '0785567343',
    '2025-06-19',
    'Corporatif',
    'Boulodrome Av de la Mer, Mandelieu',
    '50',
    'null',
    'rejected',
    'null',
    'null',
    '6/05/2025 17:43:35'::timestamp
  );
INSERT INTO external_budgets (
    client_name, client_email, client_phone,
    event_date, event_type, event_address, guest_count, meal_type,
    status, categoria, admin_comments, original_timestamp
  ) VALUES (
    'Burbi Christophe ',
    'christophe.burbi@orange.fr',
    '0620531417',
    '2025-07-12',
    'Anniversaire',
    '279 Chemin Du Castellaras 06440 Peille',
    '30',
    'null',
    'rejected',
    'null',
    'null',
    '7/05/2025 8:22:28'::timestamp
  );
INSERT INTO external_budgets (
    client_name, client_email, client_phone,
    event_date, event_type, event_address, guest_count, meal_type,
    status, categoria, admin_comments, original_timestamp
  ) VALUES (
    'Pierre LYONNET',
    'pierre.lyonnet@soletanche-bachy.com',
    '0626183624',
    '2025-06-05',
    'Corporatif',
    '45 avenue du 3 septembre, Cap D''ail',
    '60',
    'null',
    'accepted',
    'null',
    'null',
    '13/05/2025 11:49:17'::timestamp
  );
INSERT INTO external_budgets (
    client_name, client_email, client_phone,
    event_date, event_type, event_address, guest_count, meal_type,
    status, categoria, admin_comments, original_timestamp
  ) VALUES (
    'Caroline Adrados ',
    'caro.adrados@gmail.com',
    '0626282066',
    '2025-07-19',
    'Anniversaire',
    '358 avenue jules Romains. 06100 Nice ',
    '30',
    'null',
    'rejected',
    'null',
    'No dispos',
    '13/05/2025 12:07:13'::timestamp
  );
INSERT INTO external_budgets (
    client_name, client_email, client_phone,
    event_date, event_type, event_address, guest_count, meal_type,
    status, categoria, admin_comments, original_timestamp
  ) VALUES (
    'Clementine ollivier',
    'clementineollivier@live.fr',
    '0629689712',
    '2026-05-24',
    'Baptême',
    'Valbonne',
    '45',
    'null',
    'accepted',
    'null',
    'null',
    '14/05/2025 19:31:20'::timestamp
  );
INSERT INTO external_budgets (
    client_name, client_email, client_phone,
    event_date, event_type, event_address, guest_count, meal_type,
    status, categoria, admin_comments, original_timestamp
  ) VALUES (
    'Bergez-Lacoste Jennifer ',
    'jennifer.vercci@gmail.com',
    '0658819741',
    '2025-09-06',
    'Autre',
    'Chemin de l’agranas 06530 Peymeinade ',
    '15',
    'null',
    'accepted',
    'null',
    'null',
    '15/05/2025 15:40:05'::timestamp
  );
INSERT INTO external_budgets (
    client_name, client_email, client_phone,
    event_date, event_type, event_address, guest_count, meal_type,
    status, categoria, admin_comments, original_timestamp
  ) VALUES (
    'Youdale Peter',
    'peter.youdale@acri-st.fr',
    '0671927119',
    '2025-07-10',
    'Corporatif',
    '10 avenue Nicolas Copernic 06130 Grasse',
    '120',
    'null',
    'accepted',
    'null',
    'null',
    '15/05/2025 17:28:45'::timestamp
  );
INSERT INTO external_budgets (
    client_name, client_email, client_phone,
    event_date, event_type, event_address, guest_count, meal_type,
    status, categoria, admin_comments, original_timestamp
  ) VALUES (
    'DANIEL DE SEIXAS',
    'daniel.deseixas@dsd-metallerie.fr',
    '0676717196',
    '2025-07-19',
    'Anniversaire',
    '230 CHEMIN DE TERRON NICE 06200',
    '30',
    'null',
    'rejected',
    'null',
    'null',
    '17/05/2025 11:39:24'::timestamp
  );
INSERT INTO external_budgets (
    client_name, client_email, client_phone,
    event_date, event_type, event_address, guest_count, meal_type,
    status, categoria, admin_comments, original_timestamp
  ) VALUES (
    'MANTELLATO Céline',
    'celine.mantellato@gmail.com',
    '0624590754',
    '2026-06-27',
    'Mariage',
    'Le Bar sur Loup',
    '41 adultes 15 enfants',
    'null',
    'rejected',
    'null',
    'null',
    '17/05/2025 12:04:06'::timestamp
  );
INSERT INTO external_budgets (
    client_name, client_email, client_phone,
    event_date, event_type, event_address, guest_count, meal_type,
    status, categoria, admin_comments, original_timestamp
  ) VALUES (
    'Biney ',
    'oceane_060@hotmail.com',
    '0695512713',
    '2025-10-04',
    'Anniversaire',
    'Antibes ',
    '100',
    'null',
    'rejected',
    'null',
    'null',
    '18/05/2025 15:29:05'::timestamp
  );
INSERT INTO external_budgets (
    client_name, client_email, client_phone,
    event_date, event_type, event_address, guest_count, meal_type,
    status, categoria, admin_comments, original_timestamp
  ) VALUES (
    'CASSIA Fanny',
    'fanny.cassia@septeo.com',
    '0659724434',
    '2025-09-11',
    'Corporatif',
    '80 route des lucioles 06560 Valbonne',
    '110',
    'null',
    'rejected',
    'null',
    'null',
    '19/05/2025 12:49:21'::timestamp
  );
INSERT INTO external_budgets (
    client_name, client_email, client_phone,
    event_date, event_type, event_address, guest_count, meal_type,
    status, categoria, admin_comments, original_timestamp
  ) VALUES (
    'Vidal jerome',
    'jeromevidal06000@gmail.com',
    '0663024219',
    '2026-06-13',
    'Mariage',
    'Saint martin du var',
    '50',
    'null',
    'rejected',
    'null',
    'null',
    '19/05/2025 20:54:44'::timestamp
  );
INSERT INTO external_budgets (
    client_name, client_email, client_phone,
    event_date, event_type, event_address, guest_count, meal_type,
    status, categoria, admin_comments, original_timestamp
  ) VALUES (
    'Isabelle Rosset',
    'isarofa@hotmail.fr',
    '0631233737',
    '2025-06-28',
    'Anniversaire',
    '500 allée des arbousiers 06330 Roquefort les Pins ',
    '20-25',
    'null',
    'rejected',
    'null',
    'null',
    '19/05/2025 23:10:57'::timestamp
  );
INSERT INTO external_budgets (
    client_name, client_email, client_phone,
    event_date, event_type, event_address, guest_count, meal_type,
    status, categoria, admin_comments, original_timestamp
  ) VALUES (
    'Hedi Lambaraa ',
    'hedi.lambaraa@icloud.com',
    '0619994368',
    '2025-08-02',
    'Anniversaire',
    '35 chemin st esprit la celle 83170',
    '35',
    'null',
    'rejected',
    'null',
    'null',
    '20/05/2025 19:48:04'::timestamp
  );
INSERT INTO external_budgets (
    client_name, client_email, client_phone,
    event_date, event_type, event_address, guest_count, meal_type,
    status, categoria, admin_comments, original_timestamp
  ) VALUES (
    'Julien taboue',
    'julientaboue@gmail.com',
    '0760572525',
    '2025-06-18',
    'Corporatif',
    '77 avenue Gabriel hannotaux 06190 Roquebrune Cap Martin ',
    '60',
    'null',
    'accepted',
    'null',
    'null',
    '21/05/2025 8:46:02'::timestamp
  );
INSERT INTO external_budgets (
    client_name, client_email, client_phone,
    event_date, event_type, event_address, guest_count, meal_type,
    status, categoria, admin_comments, original_timestamp
  ) VALUES (
    'Montana Clement',
    'clement.montana@arkea-reim.com',
    '0609942859',
    '2025-07-24',
    'Corporatif',
    'Cagne sur mer',
    '30',
    'null',
    'rejected',
    'null',
    'null',
    '22/05/2025 14:27:21'::timestamp
  );
INSERT INTO external_budgets (
    client_name, client_email, client_phone,
    event_date, event_type, event_address, guest_count, meal_type,
    status, categoria, admin_comments, original_timestamp
  ) VALUES (
    'Laetitia Fournial',
    'laetitia.fournial@gmail.com',
    '06 98 62 07 08',
    '2025-08-02',
    'Anniversaire',
    'Domaine le chevalier 83440 Tourrettes ',
    '30',
    'null',
    'sent',
    'null',
    'null',
    '27/05/2025 14:40:54'::timestamp
  );
INSERT INTO external_budgets (
    client_name, client_email, client_phone,
    event_date, event_type, event_address, guest_count, meal_type,
    status, categoria, admin_comments, original_timestamp
  ) VALUES (
    'Franck Peron',
    'pper@oticonmedical.com',
    '0422391467',
    '2025-09-11',
    'Corporatif',
    '2720 chemin Saint Bernard , 06224 Vallauris',
    '45',
    'null',
    'rejected',
    'null',
    'null',
    '27/05/2025 15:43:04'::timestamp
  );
INSERT INTO external_budgets (
    client_name, client_email, client_phone,
    event_date, event_type, event_address, guest_count, meal_type,
    status, categoria, admin_comments, original_timestamp
  ) VALUES (
    'Carlos cochrane',
    'ccochrane83@gmail.com',
    '0646754742',
    '2025-06-06',
    'Autre',
    '117 chemin de la ponche',
    '20',
    'null',
    'rejected',
    'null',
    'null',
    '29/05/2025 21:07:26'::timestamp
  );
INSERT INTO external_budgets (
    client_name, client_email, client_phone,
    event_date, event_type, event_address, guest_count, meal_type,
    status, categoria, admin_comments, original_timestamp
  ) VALUES (
    'P Berthier',
    'apberthier@gmail.com',
    '0680528346',
    '2025-08-16',
    'Anniversaire',
    'Valbonne',
    '40',
    'null',
    'rejected',
    'null',
    'null',
    '30/05/2025 9:17:50'::timestamp
  );
INSERT INTO external_budgets (
    client_name, client_email, client_phone,
    event_date, event_type, event_address, guest_count, meal_type,
    status, categoria, admin_comments, original_timestamp
  ) VALUES (
    'Scomparin audrey',
    'scomparin.audrey@gmail.com',
    '0783344133',
    '2026-09-12',
    'Mariage',
    'Cotignac',
    '120',
    'null',
    'rejected',
    'null',
    'null',
    '30/05/2025 17:21:27'::timestamp
  );
INSERT INTO external_budgets (
    client_name, client_email, client_phone,
    event_date, event_type, event_address, guest_count, meal_type,
    status, categoria, admin_comments, original_timestamp
  ) VALUES (
    'Crouzet Marine ',
    'marine.crouzet99@gmail.com',
    '06 35 32 35 29 ',
    '2026-05-30',
    'Mariage',
    'Salon de Provence ',
    '130',
    'null',
    'rejected',
    'null',
    'null',
    '1/06/2025 19:35:33'::timestamp
  );
INSERT INTO external_budgets (
    client_name, client_email, client_phone,
    event_date, event_type, event_address, guest_count, meal_type,
    status, categoria, admin_comments, original_timestamp
  ) VALUES (
    'monnoyer jp',
    'mnjp06@yahoo.fr',
    '0673662615',
    '2025-07-12',
    'Mariage',
    'la colle sur loup',
    '50',
    'null',
    'rejected',
    'null',
    'null',
    '4/06/2025 13:35:00'::timestamp
  );
INSERT INTO external_budgets (
    client_name, client_email, client_phone,
    event_date, event_type, event_address, guest_count, meal_type,
    status, categoria, admin_comments, original_timestamp
  ) VALUES (
    'messibah rose',
    'ronca.rose@yahoo.fr',
    '0664819584',
    '2025-08-16',
    'Anniversaire',
    '950 Rte de Berins, 06380 Sospel, France',
    '10',
    'null',
    'rejected',
    'null',
    'null',
    '4/06/2025 15:43:42'::timestamp
  );
INSERT INTO external_budgets (
    client_name, client_email, client_phone,
    event_date, event_type, event_address, guest_count, meal_type,
    status, categoria, admin_comments, original_timestamp
  ) VALUES (
    'dominique Eagan',
    'dominique.eagan@coopervision-fr.com',
    '0789545674',
    '2025-07-03',
    'Corporatif',
    'Coopervision6 1800 Route des crêtes - Immeuble les 2 Arcs -Bat B - 06560 Valbonne',
    '35/40',
    'null',
    'rejected',
    'null',
    'null',
    '5/06/2025 13:48:28'::timestamp
  );
INSERT INTO external_budgets (
    client_name, client_email, client_phone,
    event_date, event_type, event_address, guest_count, meal_type,
    status, categoria, admin_comments, original_timestamp
  ) VALUES (
    'Huchet Olivier ',
    'olivier_huchet@yahoo.fr',
    '0664244672',
    '2025-07-18',
    'Corporatif',
    '366 bd du Mercantour à Nice',
    '60',
    'null',
    'accepted',
    'null',
    'null',
    '6/06/2025 15:32:28'::timestamp
  );
INSERT INTO external_budgets (
    client_name, client_email, client_phone,
    event_date, event_type, event_address, guest_count, meal_type,
    status, categoria, admin_comments, original_timestamp
  ) VALUES (
    'corinne',
    'corinneleveziel@hotmail.com',
    '0634176485',
    '2025-07-12',
    'Anniversaire',
    'Nice ',
    '30 à 40 ',
    'null',
    'rejected',
    'null',
    'null',
    '7/06/2025 11:36:11'::timestamp
  );
INSERT INTO external_budgets (
    client_name, client_email, client_phone,
    event_date, event_type, event_address, guest_count, meal_type,
    status, categoria, admin_comments, original_timestamp
  ) VALUES (
    'Edery laurent ',
    'laurentedery@yahoo.com',
    '0612535440',
    '2025-06-28',
    'Anniversaire',
    '288',
    '40',
    'null',
    'rejected',
    'null',
    'null',
    '8/06/2025 16:18:24'::timestamp
  );
INSERT INTO external_budgets (
    client_name, client_email, client_phone,
    event_date, event_type, event_address, guest_count, meal_type,
    status, categoria, admin_comments, original_timestamp
  ) VALUES (
    'Bonino Elsa',
    'elsa.bonino@gmail.com',
    '0616842333',
    '2025-10-08',
    'Autre',
    '6 avenue de la bastide, grasse',
    '40',
    'null',
    'rejected',
    'null',
    'null',
    '9/06/2025 21:07:59'::timestamp
  );
INSERT INTO external_budgets (
    client_name, client_email, client_phone,
    event_date, event_type, event_address, guest_count, meal_type,
    status, categoria, admin_comments, original_timestamp
  ) VALUES (
    'Fanny Rostan',
    'fanny.rostan@gmail.com',
    '0637420183',
    '2025-07-05',
    'Anniversaire',
    '10, Chemin de la Tour de Bellet',
    '70',
    'null',
    'rejected',
    'null',
    'null',
    '10/06/2025 10:27:24'::timestamp
  );
INSERT INTO external_budgets (
    client_name, client_email, client_phone,
    event_date, event_type, event_address, guest_count, meal_type,
    status, categoria, admin_comments, original_timestamp
  ) VALUES (
    'MERIEL-BUSSY Victor',
    'victor.meriel@partizan.com',
    '07 77 81 23 22',
    '2025-06-18',
    'Corporatif',
    '21 Avenue Fiesole Cannes, Provence-Alpes-Côte d''Azur 06400',
    '25',
    'null',
    'sent',
    'null',
    'null',
    '11/06/2025 9:53:27'::timestamp
  );
INSERT INTO external_budgets (
    client_name, client_email, client_phone,
    event_date, event_type, event_address, guest_count, meal_type,
    status, categoria, admin_comments, original_timestamp
  ) VALUES (
    'Carla agniel ',
    'carla.agniel@decathlon.com',
    '0652258687',
    '2025-06-27',
    'Autre',
    'Decathlon antibes ',
    '40',
    'null',
    'sent',
    'null',
    'null',
    '11/06/2025 11:45:13'::timestamp
  );
INSERT INTO external_budgets (
    client_name, client_email, client_phone,
    event_date, event_type, event_address, guest_count, meal_type,
    status, categoria, admin_comments, original_timestamp
  ) VALUES (
    'Medjian Mathieu ',
    'mathieu.medjian@orange.fr',
    '06.63.30.24.31 ',
    '2025-09-27',
    'Anniversaire',
    '1561 route du mont chauve 06950 falicon ',
    '40',
    'null',
    'rejected',
    'null',
    'null',
    '11/06/2025 18:28:45'::timestamp
  );
INSERT INTO external_budgets (
    client_name, client_email, client_phone,
    event_date, event_type, event_address, guest_count, meal_type,
    status, categoria, admin_comments, original_timestamp
  ) VALUES (
    'Mathilde Perard ',
    'Perard.mathilde20@gmail.com',
    '0640624243',
    '2026-07-15',
    'Baptême',
    '16 allée des condamines la gaude ',
    '20',
    'null',
    'rejected',
    'null',
    'null',
    '12/06/2025 18:19:42'::timestamp
  );
INSERT INTO external_budgets (
    client_name, client_email, client_phone,
    event_date, event_type, event_address, guest_count, meal_type,
    status, categoria, admin_comments, original_timestamp
  ) VALUES (
    'Morgen, Sabine',
    'morgen.sabine@orange.fr',
    '0603459602',
    '2025-10-25',
    'Anniversaire',
    'Antibes, chem.des Rastines',
    'Max20',
    'null',
    'rejected',
    'null',
    'null',
    '13/06/2025 12:57:40'::timestamp
  );
INSERT INTO external_budgets (
    client_name, client_email, client_phone,
    event_date, event_type, event_address, guest_count, meal_type,
    status, categoria, admin_comments, original_timestamp
  ) VALUES (
    'TreGueR.Hubert ',
    'hub.tgr@gmail.com',
    '0672880807',
    '2025-06-21',
    'Autre',
    'Grasse ',
    '16',
    'null',
    'rejected',
    'null',
    'null',
    '17/06/2025 3:05:41'::timestamp
  );
INSERT INTO external_budgets (
    client_name, client_email, client_phone,
    event_date, event_type, event_address, guest_count, meal_type,
    status, categoria, admin_comments, original_timestamp
  ) VALUES (
    'BRULE Amélia',
    'assistante.direction@maisondumineur.com',
    '04.93.24.58.00',
    '2025-07-03',
    'Corporatif',
    '577 avenue henri giraud ',
    '69',
    'null',
    'sent',
    'null',
    'null',
    '17/06/2025 11:55:22'::timestamp
  );
INSERT INTO external_budgets (
    client_name, client_email, client_phone,
    event_date, event_type, event_address, guest_count, meal_type,
    status, categoria, admin_comments, original_timestamp
  ) VALUES (
    'DUBAN JEAN-FILIPE',
    'jduban@amazon.fr',
    '0613706775',
    '2025-07-16',
    'Corporatif',
    '8EME RUE 06510 CARROS',
    '100',
    'null',
    'sent',
    'null',
    'null',
    '20/06/2025 11:11:52'::timestamp
  );
INSERT INTO external_budgets (
    client_name, client_email, client_phone,
    event_date, event_type, event_address, guest_count, meal_type,
    status, categoria, admin_comments, original_timestamp
  ) VALUES (
    'Pauline Gopcevic',
    'pauline.gopcevic@gmail.com',
    '0624054442',
    '2025-10-04',
    'Anniversaire',
    'La Gorra 06440 Peille',
    '100',
    'null',
    'rejected',
    'null',
    'null',
    '21/06/2025 20:42:35'::timestamp
  );
INSERT INTO external_budgets (
    client_name, client_email, client_phone,
    event_date, event_type, event_address, guest_count, meal_type,
    status, categoria, admin_comments, original_timestamp
  ) VALUES (
    'Dubois Romy',
    'romydubois@hotmail.fr',
    '0784280604',
    '2026-06-06',
    'Mariage',
    'Althen-des-Paluds',
    '59',
    'null',
    'rejected',
    'null',
    'null',
    '22/06/2025 19:28:45'::timestamp
  );
INSERT INTO external_budgets (
    client_name, client_email, client_phone,
    event_date, event_type, event_address, guest_count, meal_type,
    status, categoria, admin_comments, original_timestamp
  ) VALUES (
    'BRUNEL CHRISTELLE',
    'christelle.brunel@asmonacorugby.com',
    '0643915364',
    '2025-07-25',
    'Corporatif',
    'Stade Prince Hereditaire AV DES ANCIENS COMBATTANTS  Jacques 06240 BEAUSOLEIL',
    '80',
    'null',
    'accepted',
    'null',
    'null',
    '25/06/2025 10:52:22'::timestamp
  );
INSERT INTO external_budgets (
    client_name, client_email, client_phone,
    event_date, event_type, event_address, guest_count, meal_type,
    status, categoria, admin_comments, original_timestamp
  ) VALUES (
    'Fabienne Derrien',
    'derrienfc@orange.fr',
    '0680864148',
    '2025-08-23',
    'Anniversaire',
    'Allée De Paillos 2, 06340 La Trinité',
    '30',
    'null',
    'rejected',
    'null',
    'null',
    '27/06/2025 11:49:26'::timestamp
  );
INSERT INTO external_budgets (
    client_name, client_email, client_phone,
    event_date, event_type, event_address, guest_count, meal_type,
    status, categoria, admin_comments, original_timestamp
  ) VALUES (
    'Bruno Depoortere',
    'b.depoortere@orange.fr',
    '0788493490',
    '2025-08-24',
    'Anniversaire',
    'Châteauneuf grasse',
    '24',
    'null',
    'accepted',
    'null',
    'null',
    '29/06/2025 8:23:51'::timestamp
  );
INSERT INTO external_budgets (
    client_name, client_email, client_phone,
    event_date, event_type, event_address, guest_count, meal_type,
    status, categoria, admin_comments, original_timestamp
  ) VALUES (
    'Failutti Edith',
    'edithfailutti@hotmail.fr',
    '0686914931',
    '2025-10-18',
    'Anniversaire',
    'DRAP',
    '70 à 80',
    'null',
    'rejected',
    'null',
    'null',
    '1/07/2025 21:34:04'::timestamp
  );
INSERT INTO external_budgets (
    client_name, client_email, client_phone,
    event_date, event_type, event_address, guest_count, meal_type,
    status, categoria, admin_comments, original_timestamp
  ) VALUES (
    'Clothilde COLLET ',
    'collet.clothilde@outlook.com',
    '0673243098',
    '2025-10-18',
    'Mariage',
    'Chateau Yssole à CABASSE ',
    '14 adultes et 4 enfants (de 7 à 12 ans) ',
    'null',
    'rejected',
    'null',
    'null',
    '2/07/2025 15:43:13'::timestamp
  );
INSERT INTO external_budgets (
    client_name, client_email, client_phone,
    event_date, event_type, event_address, guest_count, meal_type,
    status, categoria, admin_comments, original_timestamp
  ) VALUES (
    'Clothilde COLLET ',
    'collet.clothilde@hotmail.com',
    '0673243098',
    '2025-10-18',
    'Mariage',
    'Chateau Yssole à CABASSE',
    '14 adultes et 4 enfants (de 7 à 12 ans) ',
    'null',
    'rejected',
    'null',
    'null',
    '2/07/2025 15:46:30'::timestamp
  );
INSERT INTO external_budgets (
    client_name, client_email, client_phone,
    event_date, event_type, event_address, guest_count, meal_type,
    status, categoria, admin_comments, original_timestamp
  ) VALUES (
    'Matthieu Chaminade ',
    'matthieuchaminade@msn.com',
    '0619810707',
    '2025-10-04',
    'Mariage',
    '1515 route de Nice, Chateauneuf de grasse',
    '50',
    'null',
    'rejected',
    'null',
    'null',
    '5/07/2025 11:39:44'::timestamp
  );
INSERT INTO external_budgets (
    client_name, client_email, client_phone,
    event_date, event_type, event_address, guest_count, meal_type,
    status, categoria, admin_comments, original_timestamp
  ) VALUES (
    'FOURNET Emilie',
    'fournet.emilie@hotmail.fr',
    '0626998418',
    '2025-08-02',
    'Anniversaire',
    'Route de saint michel, le bar sur loup 06620',
    '40-45',
    'null',
    'rejected',
    'null',
    'null',
    '8/07/2025 16:35:03'::timestamp
  );
INSERT INTO external_budgets (
    client_name, client_email, client_phone,
    event_date, event_type, event_address, guest_count, meal_type,
    status, categoria, admin_comments, original_timestamp
  ) VALUES (
    'Sylvie Navarro',
    'nvr.sylvie@gmail.com',
    '0670413375',
    '2025-07-13',
    'Anniversaire',
    '19 avenue Antoine galante nice',
    '20',
    'null',
    'rejected',
    'null',
    'null',
    '9/07/2025 12:50:03'::timestamp
  );
INSERT INTO external_budgets (
    client_name, client_email, client_phone,
    event_date, event_type, event_address, guest_count, meal_type,
    status, categoria, admin_comments, original_timestamp
  ) VALUES (
    'NABIL Marianne',
    'marianne.nabil@actualgroup.com',
    '0635020271',
    '2025-09-16',
    'Corporatif',
    '105 route de Canta Galet 06200 Nice',
    '40',
    'null',
    'rejected',
    'null',
    'null',
    '10/07/2025 9:49:56'::timestamp
  );
INSERT INTO external_budgets (
    client_name, client_email, client_phone,
    event_date, event_type, event_address, guest_count, meal_type,
    status, categoria, admin_comments, original_timestamp
  ) VALUES (
    'Valérie Cambou',
    'Valcambou06@gmail.com',
    '0616992422',
    '2025-09-20',
    'Anniversaire',
    '1542 chemin des moulins',
    '10',
    'null',
    'rejected',
    'null',
    'null',
    '11/07/2025 15:25:16'::timestamp
  );
INSERT INTO external_budgets (
    client_name, client_email, client_phone,
    event_date, event_type, event_address, guest_count, meal_type,
    status, categoria, admin_comments, original_timestamp
  ) VALUES (
    'Carla Sozonoff ',
    'csozonoff@gmail.com',
    '0628634654',
    '2025-08-30',
    'Anniversaire',
    '75 Avenue des anémones, Roquebrune cap martin',
    '50',
    'null',
    'rejected',
    'null',
    'null',
    '13/07/2025 17:57:35'::timestamp
  );
INSERT INTO external_budgets (
    client_name, client_email, client_phone,
    event_date, event_type, event_address, guest_count, meal_type,
    status, categoria, admin_comments, original_timestamp
  ) VALUES (
    'MICHELATO EMMA',
    'emma.michelato@npm.net.bmw.fr',
    '0743365397',
    '2025-10-04',
    'Autre',
    'BMW MOTORRAD NICE Av. Emmanuel Pontremoli Batiment A1, 06200 Nice',
    '150',
    'null',
    'rejected',
    'null',
    'null',
    '16/07/2025 14:54:33'::timestamp
  );
INSERT INTO external_budgets (
    client_name, client_email, client_phone,
    event_date, event_type, event_address, guest_count, meal_type,
    status, categoria, admin_comments, original_timestamp
  ) VALUES (
    'Baioni paule',
    'paule83700@gmail.com',
    '619904407',
    '2025-09-27',
    'Anniversaire',
    'Saint raphael',
    '40',
    'null',
    'rejected',
    'null',
    'null',
    '18/07/2025 7:26:08'::timestamp
  );
INSERT INTO external_budgets (
    client_name, client_email, client_phone,
    event_date, event_type, event_address, guest_count, meal_type,
    status, categoria, admin_comments, original_timestamp
  ) VALUES (
    'Brobst Morgane',
    'morgane.brobst@elsan.care',
    '0619092363',
    '2025-11-22',
    'Anniversaire',
    '301 avenue st vincent 83700 saint Raphael ',
    '25',
    'null',
    'rejected',
    'null',
    'null',
    '20/07/2025 12:14:28'::timestamp
  );
INSERT INTO external_budgets (
    client_name, client_email, client_phone,
    event_date, event_type, event_address, guest_count, meal_type,
    status, categoria, admin_comments, original_timestamp
  ) VALUES (
    'ARTIER Emilie',
    'emiile.artieri@hotmail.fr',
    '0672495198',
    '2026-12-09',
    'Mariage',
    'domaine des aigas sospel',
    '70',
    'null',
    'pending',
    'null',
    'null',
    '21/07/2025 8:34:00'::timestamp
  );
INSERT INTO external_budgets (
    client_name, client_email, client_phone,
    event_date, event_type, event_address, guest_count, meal_type,
    status, categoria, admin_comments, original_timestamp
  ) VALUES (
    'Matecki Toni',
    'tonimatecki@orange.fr',
    '0624051037',
    '0025-08-09',
    'Anniversaire',
    '236 ch de Fontvieille.  La Turbie',
    '10',
    'null',
    'rejected',
    'null',
    'null',
    '21/07/2025 19:34:20'::timestamp
  );
INSERT INTO external_budgets (
    client_name, client_email, client_phone,
    event_date, event_type, event_address, guest_count, meal_type,
    status, categoria, admin_comments, original_timestamp
  ) VALUES (
    'Pamart vanessa ',
    'panc83440@gmail.com',
    '0749593370',
    '2026-06-06',
    'Mariage',
    'Tourettes (Var)',
    '50 adultes 11 ados 11 enfants ',
    'null',
    'pending',
    'null',
    'null',
    '29/07/2025 6:56:34'::timestamp
  );
INSERT INTO external_budgets (
    client_name, client_email, client_phone,
    event_date, event_type, event_address, guest_count, meal_type,
    status, categoria, admin_comments, original_timestamp
  ) VALUES (
    'Laura Labescat',
    'laura.labescat@catamaran-outremer.com',
    '06 80 96 19 74',
    '2025-09-10',
    'Anniversaire',
    'Cannes',
    '30 - 40',
    'null',
    'rejected',
    'null',
    'null',
    '29/07/2025 17:03:29'::timestamp
  );
INSERT INTO external_budgets (
    client_name, client_email, client_phone,
    event_date, event_type, event_address, guest_count, meal_type,
    status, categoria, admin_comments, original_timestamp
  ) VALUES (
    'laura lara ',
    'laauralara28@gmail.com',
    '0745481155',
    '2026-04-09',
    'Mariage',
    'terrain familial à grasse ',
    '85',
    'null',
    'rejected',
    'null',
    'null',
    '29/07/2025 20:51:54'::timestamp
  );
INSERT INTO external_budgets (
    client_name, client_email, client_phone,
    event_date, event_type, event_address, guest_count, meal_type,
    status, categoria, admin_comments, original_timestamp
  ) VALUES (
    'Victoria Taittinger',
    'victoria.taittinger@googlemail.com',
    '+447890665630',
    '2025-09-08',
    'Anniversaire',
    '65 Chemin de la Moutte, Villa L’Aire, Les Salins, Saint Tropez',
    '25',
    'null',
    'rejected',
    'null',
    'null',
    '31/07/2025 12:00:12'::timestamp
  );
INSERT INTO external_budgets (
    client_name, client_email, client_phone,
    event_date, event_type, event_address, guest_count, meal_type,
    status, categoria, admin_comments, original_timestamp
  ) VALUES (
    'Zunino Yoann',
    'yoann.zunino2501@gmail.Com',
    '0789649129',
    '2026-06-26',
    'Mariage',
    'Le Sequoia, Av. du Pylône, 06600 Antibes',
    '50 à 70 ',
    'null',
    'rejected',
    'null',
    'null',
    '1/08/2025 11:57:46'::timestamp
  );
INSERT INTO external_budgets (
    client_name, client_email, client_phone,
    event_date, event_type, event_address, guest_count, meal_type,
    status, categoria, admin_comments, original_timestamp
  ) VALUES (
    'Cali Vivien',
    'vivien.cali@eurovia.com',
    '0621673090',
    '2025-09-13',
    'Corporatif',
    'BRIGNOLES',
    '20',
    'null',
    'rejected',
    'null',
    'null',
    '2/08/2025 20:05:56'::timestamp
  );
INSERT INTO external_budgets (
    client_name, client_email, client_phone,
    event_date, event_type, event_address, guest_count, meal_type,
    status, categoria, admin_comments, original_timestamp
  ) VALUES (
    'Margaux Glibert',
    'margaux.glibertv@gmail.com',
    '0630783109',
    '2026-06-20',
    'Mariage',
    '336 Av. de la Tour, 06390 Châteauneuf-Villevieille',
    '55 adultes et 12 enfants',
    'null',
    'rejected',
    'null',
    'null',
    '5/08/2025 14:36:39'::timestamp
  );
INSERT INTO external_budgets (
    client_name, client_email, client_phone,
    event_date, event_type, event_address, guest_count, meal_type,
    status, categoria, admin_comments, original_timestamp
  ) VALUES (
    'Gasquy Sacha ',
    'sachagasquy@gmail.com',
    '0647187148',
    '2025-08-12',
    'Autre',
    '1414 route de l’Argentière 83600 Les adrets de l’esterel',
    '25',
    'null',
    'accepted',
    'null',
    'null',
    '9/08/2025 11:11:23'::timestamp
  );
INSERT INTO external_budgets (
    client_name, client_email, client_phone,
    event_date, event_type, event_address, guest_count, meal_type,
    status, categoria, admin_comments, original_timestamp
  ) VALUES (
    'Krystel LANDRA',
    'krystel.landra@wanadoo.fr',
    '0675338013',
    '2026-08-04',
    'Mariage',
    'La roquette sur Siagne (domicile) ',
    '40',
    'null',
    'rejected',
    'null',
    'null',
    '10/08/2025 19:08:29'::timestamp
  );
INSERT INTO external_budgets (
    client_name, client_email, client_phone,
    event_date, event_type, event_address, guest_count, meal_type,
    status, categoria, admin_comments, original_timestamp
  ) VALUES (
    'PETRINI MARC',
    'm.petrini@mediaco.fr',
    '0648580056',
    '2025-09-04',
    'Corporatif',
    '724 boulevard du mercantour',
    '40',
    'null',
    'accepted',
    'null',
    'null',
    '11/08/2025 14:12:05'::timestamp
  );
INSERT INTO external_budgets (
    client_name, client_email, client_phone,
    event_date, event_type, event_address, guest_count, meal_type,
    status, categoria, admin_comments, original_timestamp
  ) VALUES (
    'Georges',
    'georges4213@free.fr',
    '0634575651',
    '2025-10-25',
    'Anniversaire',
    'Vence',
    '50',
    'null',
    'rejected',
    'null',
    'null',
    '13/08/2025 14:34:31'::timestamp
  );
INSERT INTO external_budgets (
    client_name, client_email, client_phone,
    event_date, event_type, event_address, guest_count, meal_type,
    status, categoria, admin_comments, original_timestamp
  ) VALUES (
    'Angelica Biafora Ross',
    'angelicabia81@gmail.com',
    '0633594802',
    '2025-10-25',
    'Anniversaire',
    '529 chemin de peire luche',
    '45/50',
    'null',
    'accepted',
    'null',
    'null',
    '17/08/2025 13:45:42'::timestamp
  );
INSERT INTO external_budgets (
    client_name, client_email, client_phone,
    event_date, event_type, event_address, guest_count, meal_type,
    status, categoria, admin_comments, original_timestamp
  ) VALUES (
    'Leme Cécile ',
    'kassy30@orange.fr',
    '0767772063',
    '2026-05-23',
    'Mariage',
    'Grasse',
    '50 +10 enfants ',
    'null',
    'pending',
    'null',
    'null',
    '18/08/2025 12:32:05'::timestamp
  );
INSERT INTO external_budgets (
    client_name, client_email, client_phone,
    event_date, event_type, event_address, guest_count, meal_type,
    status, categoria, admin_comments, original_timestamp
  ) VALUES (
    'Delaygue Nathalie ',
    'nathalie.bonifazio@gmail.com',
    '0663301824',
    '2025-09-13',
    'Baptême',
    '391 avenue Aristide Briand 06500 Gorbio',
    '20',
    'null',
    'rejected',
    'null',
    'null',
    '19/08/2025 15:04:29'::timestamp
  );
INSERT INTO external_budgets (
    client_name, client_email, client_phone,
    event_date, event_type, event_address, guest_count, meal_type,
    status, categoria, admin_comments, original_timestamp
  ) VALUES (
    'Robert BIGEL',
    'robert.bigel@orange.fr',
    '0608539623',
    '2025-09-13',
    'Autre',
    'Le Bellet  06420  LA TOUR  ',
    '20 mini - 25',
    'null',
    'rejected',
    'null',
    'null',
    '19/08/2025 18:45:54'::timestamp
  );
INSERT INTO external_budgets (
    client_name, client_email, client_phone,
    event_date, event_type, event_address, guest_count, meal_type,
    status, categoria, admin_comments, original_timestamp
  ) VALUES (
    'De gunten Cécile',
    'ceciledegunten@gmail.com',
    '0681440900',
    '2025-08-30',
    'Anniversaire',
    'Valbonne',
    'Une vingtaine de personnes ',
    'null',
    'rejected',
    'null',
    'null',
    '20/08/2025 16:38:49'::timestamp
  );
INSERT INTO external_budgets (
    client_name, client_email, client_phone,
    event_date, event_type, event_address, guest_count, meal_type,
    status, categoria, admin_comments, original_timestamp
  ) VALUES (
    'De barros fred',
    'Debarros.f.f@gmail.com',
    '06-24-36-57-38 ',
    '2025-08-22',
    'Autre',
    '294ch des darboussieres 06220 vallauris',
    '17',
    'null',
    'rejected',
    'null',
    'null',
    '21/08/2025 0:10:21'::timestamp
  );
INSERT INTO external_budgets (
    client_name, client_email, client_phone,
    event_date, event_type, event_address, guest_count, meal_type,
    status, categoria, admin_comments, original_timestamp
  ) VALUES (
    'Marc PETRINI',
    'm.petrini@mediaco.fr',
    '0648580056',
    '2025-09-04',
    'Corporatif',
    '724 boulevard du Mercantour 06 nice',
    '45',
    'null',
    'accepted',
    'null',
    'null',
    '22/08/2025 11:39:21'::timestamp
  );
INSERT INTO external_budgets (
    client_name, client_email, client_phone,
    event_date, event_type, event_address, guest_count, meal_type,
    status, categoria, admin_comments, original_timestamp
  ) VALUES (
    'ducharne marie-allison',
    'marieallison.ducharne@gmail.com',
    '0666041579',
    '2026-07-18',
    'Mariage',
    'ferme saint hugues pujaut 30',
    '65',
    'null',
    'rejected',
    'null',
    'null',
    '22/08/2025 16:13:37'::timestamp
  );
INSERT INTO external_budgets (
    client_name, client_email, client_phone,
    event_date, event_type, event_address, guest_count, meal_type,
    status, categoria, admin_comments, original_timestamp
  ) VALUES (
    'Sara Roddis',
    'sara.roddis@hotmail.com',
    '00447989571408',
    '2025-08-29',
    'Anniversaire',
    'TBC',
    '16',
    'null',
    'accepted',
    'null',
    'null',
    '25/08/2025 16:51:50'::timestamp
  );
INSERT INTO external_budgets (
    client_name, client_email, client_phone,
    event_date, event_type, event_address, guest_count, meal_type,
    status, categoria, admin_comments, original_timestamp
  ) VALUES (
    'Joussein Ludovic ',
    'ludovictaxinice@gmail.com',
    '0659049019',
    '2026-01-15',
    'Autre',
    'St Paul de Vence ',
    '70',
    'null',
    'pending',
    'null',
    'null',
    '26/08/2025 14:32:06'::timestamp
  );
INSERT INTO external_budgets (
    client_name, client_email, client_phone,
    event_date, event_type, event_address, guest_count, meal_type,
    status, categoria, admin_comments, original_timestamp
  ) VALUES (
    'Vincent S',
    'vinc006@yahoo.fr',
    '07 49 41 21 40‬',
    '2025-10-26',
    'Anniversaire',
    'Biot',
    '50 à 70',
    'null',
    'rejected',
    'null',
    'null',
    '26/08/2025 15:55:40'::timestamp
  );
INSERT INTO external_budgets (
    client_name, client_email, client_phone,
    event_date, event_type, event_address, guest_count, meal_type,
    status, categoria, admin_comments, original_timestamp
  ) VALUES (
    'Adisson Jean-Marie ',
    'j.adisson@orange.fr',
    '0673354030',
    '2026-05-03',
    'Autre',
    'Biot',
    '60',
    'null',
    'rejected',
    'null',
    'null',
    '27/08/2025 11:50:06'::timestamp
  );
INSERT INTO external_budgets (
    client_name, client_email, client_phone,
    event_date, event_type, event_address, guest_count, meal_type,
    status, categoria, admin_comments, original_timestamp
  ) VALUES (
    'Anne PERINETTI',
    'anneperinetti06@gmail.com',
    '0664140664',
    '2025-09-20',
    'Anniversaire',
    'Mougins',
    '22',
    'null',
    'rejected',
    'null',
    'null',
    '30/08/2025 18:01:54'::timestamp
  );
INSERT INTO external_budgets (
    client_name, client_email, client_phone,
    event_date, event_type, event_address, guest_count, meal_type,
    status, categoria, admin_comments, original_timestamp
  ) VALUES (
    'Pamart vanessa',
    'panc83440@gmail.com',
    '0665054910',
    '2026-06-06',
    'Mariage',
    'Fayence',
    '70 adultes 15 enfants',
    'null',
    'rejected',
    'null',
    'null',
    '31/08/2025 0:35:54'::timestamp
  );
INSERT INTO external_budgets (
    client_name, client_email, client_phone,
    event_date, event_type, event_address, guest_count, meal_type,
    status, categoria, admin_comments, original_timestamp
  ) VALUES (
    'REYNAUD Mathilde',
    'mathilde.reynaud14@gmail.com',
    '0631904383',
    '2026-07-11',
    'Mariage',
    '1715 route de biot 06152 VALBONNE',
    '45',
    'null',
    'rejected',
    'null',
    'null',
    '31/08/2025 9:49:02'::timestamp
  );
INSERT INTO external_budgets (
    client_name, client_email, client_phone,
    event_date, event_type, event_address, guest_count, meal_type,
    status, categoria, admin_comments, original_timestamp
  ) VALUES (
    'Dho adrianne',
    'adriannedho@gmail.com',
    '0626802100',
    '2025-12-20',
    'Autre',
    'CAVALAIRE sur mer',
    '100',
    'null',
    'rejected',
    'null',
    'null',
    '31/08/2025 12:43:53'::timestamp
  );
INSERT INTO external_budgets (
    client_name, client_email, client_phone,
    event_date, event_type, event_address, guest_count, meal_type,
    status, categoria, admin_comments, original_timestamp
  ) VALUES (
    'LO VERDE Ludovic',
    'ludovic982@gmail.com',
    '0664681162',
    '2025-12-27',
    'Mariage',
    'Salle Polyvalente 06320 LA TURBIE',
    '100',
    'null',
    'rejected',
    'null',
    'null',
    '2/09/2025 17:10:08'::timestamp
  );
INSERT INTO external_budgets (
    client_name, client_email, client_phone,
    event_date, event_type, event_address, guest_count, meal_type,
    status, categoria, admin_comments, original_timestamp
  ) VALUES (
    'LETELLIER Adrien',
    'adrien.l@eyr06.com',
    '0493935408',
    '2025-09-19',
    'Corporatif',
    '411 chemin de st Pechaire 06600 Antibes',
    '11',
    'null',
    'rejected',
    'null',
    'null',
    '3/09/2025 11:12:33'::timestamp
  );
INSERT INTO external_budgets (
    client_name, client_email, client_phone,
    event_date, event_type, event_address, guest_count, meal_type,
    status, categoria, admin_comments, original_timestamp
  ) VALUES (
    'Vilette Agnes ',
    'agnesvilette@yahoo.fr',
    '0617852940',
    '2025-09-21',
    'Anniversaire',
    'Route de notre dame à roquefort les pins ',
    '30',
    'null',
    'rejected',
    'null',
    'null',
    '5/09/2025 8:18:48'::timestamp
  );
INSERT INTO external_budgets (
    client_name, client_email, client_phone,
    event_date, event_type, event_address, guest_count, meal_type,
    status, categoria, admin_comments, original_timestamp
  ) VALUES (
    'Charles Caroline ',
    'carocharles1303@gmail.com',
    '661408181',
    '2025-11-11',
    'Anniversaire',
    'La Bergerie Luceram',
    '45',
    'null',
    'rejected',
    'null',
    'null',
    '5/09/2025 11:09:36'::timestamp
  );
INSERT INTO external_budgets (
    client_name, client_email, client_phone,
    event_date, event_type, event_address, guest_count, meal_type,
    status, categoria, admin_comments, original_timestamp
  ) VALUES (
    'Cosnefroy matéo',
    'mcosnefroy@gmail.com',
    '0668515596',
    '2026-06-13',
    'Mariage',
    'vignoble Rasse',
    '100',
    'null',
    'pending',
    'null',
    'null',
    '7/09/2025 16:02:37'::timestamp
  );
INSERT INTO external_budgets (
    client_name, client_email, client_phone,
    event_date, event_type, event_address, guest_count, meal_type,
    status, categoria, admin_comments, original_timestamp
  ) VALUES (
    'CARON Hortense',
    'hortense.caron@essec.edu',
    '0698203313',
    '2026-09-26',
    'Mariage',
    'A déterminer. A proximité d''Avignon. ',
    '160',
    'null',
    'rejected',
    'null',
    'null',
    '7/09/2025 20:31:17'::timestamp
  );
INSERT INTO external_budgets (
    client_name, client_email, client_phone,
    event_date, event_type, event_address, guest_count, meal_type,
    status, categoria, admin_comments, original_timestamp
  ) VALUES (
    'CHEVASSON',
    'severine.chevasson@gmail.com',
    'SEVERINE',
    '2025-11-29',
    'Anniversaire',
    'SAINT MAXIMIN LA SAINTE BAUME 83',
    '20',
    'null',
    'rejected',
    'null',
    'null',
    '8/09/2025 11:24:04'::timestamp
  );
INSERT INTO external_budgets (
    client_name, client_email, client_phone,
    event_date, event_type, event_address, guest_count, meal_type,
    status, categoria, admin_comments, original_timestamp
  ) VALUES (
    'Llados Alexandra ',
    'alessandra.randazzo09@gmail.com',
    '06 59 11 67 63 ',
    '2026-07-18',
    'Baptême',
    '06440 L''Escarène ',
    '20 adultes 14 enfants',
    'null',
    'rejected',
    'null',
    'null',
    '8/09/2025 19:21:01'::timestamp
  );
INSERT INTO external_budgets (
    client_name, client_email, client_phone,
    event_date, event_type, event_address, guest_count, meal_type,
    status, categoria, admin_comments, original_timestamp
  ) VALUES (
    'Labouret maxime ',
    'maximelabouret@gmail.com',
    '0669111938',
    '2026-01-31',
    'Anniversaire',
    'Salle communale brignoles ',
    'Environ 20 max',
    'null',
    'rejected',
    'null',
    'null',
    '8/09/2025 19:41:12'::timestamp
  );
INSERT INTO external_budgets (
    client_name, client_email, client_phone,
    event_date, event_type, event_address, guest_count, meal_type,
    status, categoria, admin_comments, original_timestamp
  ) VALUES (
    'Mazzuca Kevin ',
    'kevin.mazzuca@icloud.com',
    '0651130315',
    '2025-10-03',
    'Autre',
    '824 boulevard du mercantour Nice ',
    'Environ 20',
    'null',
    'accepted',
    'null',
    'null',
    '9/09/2025 10:29:36'::timestamp
  );
INSERT INTO external_budgets (
    client_name, client_email, client_phone,
    event_date, event_type, event_address, guest_count, meal_type,
    status, categoria, admin_comments, original_timestamp
  ) VALUES (
    'Mallet Valérie ',
    'dv.mallet@gmail.com',
    '0618963931',
    '2026-05-30',
    'Mariage',
    'Salernes',
    '30/50',
    'null',
    'rejected',
    'null',
    'null',
    '10/09/2025 7:56:57'::timestamp
  );
INSERT INTO external_budgets (
    client_name, client_email, client_phone,
    event_date, event_type, event_address, guest_count, meal_type,
    status, categoria, admin_comments, original_timestamp
  ) VALUES (
    'Mouchlack Marine',
    'mouchlack.m@hotmail.com',
    '0684450354',
    '2025-10-31',
    'Anniversaire',
    '146 chemin fanton d’Andon 06410 Biot',
    '20/25 ',
    'null',
    'rejected',
    'null',
    'null',
    '13/09/2025 20:38:37'::timestamp
  );
INSERT INTO external_budgets (
    client_name, client_email, client_phone,
    event_date, event_type, event_address, guest_count, meal_type,
    status, categoria, admin_comments, original_timestamp
  ) VALUES (
    'Fabienne Rouman',
    'fabienne.rouman@gmail.com',
    '0607136542',
    '2025-09-21',
    'Anniversaire',
    '18 avenue Bellevue 06100 Nice',
    '20',
    'null',
    'rejected',
    'null',
    'null',
    '14/09/2025 16:31:05'::timestamp
  );
INSERT INTO external_budgets (
    client_name, client_email, client_phone,
    event_date, event_type, event_address, guest_count, meal_type,
    status, categoria, admin_comments, original_timestamp
  ) VALUES (
    'Robin GONNARD',
    'robin.gonnard@hotmail.fr',
    '0645707048',
    '2026-06-20',
    'Mariage',
    'Chateau St Esprit - 449 Rte des Nouradons, 83300 Draguignan',
    '80',
    'null',
    'rejected',
    'null',
    'null',
    '15/09/2025 16:50:22'::timestamp
  );
INSERT INTO external_budgets (
    client_name, client_email, client_phone,
    event_date, event_type, event_address, guest_count, meal_type,
    status, categoria, admin_comments, original_timestamp
  ) VALUES (
    'PIOCHE Alice',
    'alice.pioche@gmail.com',
    '0624641049',
    '2026-08-08',
    'Mariage',
    '30 chemin de la tete au lion 06130 Grasse',
    '50',
    'null',
    'rejected',
    'null',
    'null',
    '17/09/2025 11:13:27'::timestamp
  );
INSERT INTO external_budgets (
    client_name, client_email, client_phone,
    event_date, event_type, event_address, guest_count, meal_type,
    status, categoria, admin_comments, original_timestamp
  ) VALUES (
    'Gottsmann florie ',
    'floriegottsmann@hotmail.com',
    '0768556447',
    '2026-06-20',
    'Mariage',
    'Agay ',
    '40',
    'null',
    'rejected',
    'null',
    'null',
    '18/09/2025 19:42:49'::timestamp
  );
INSERT INTO external_budgets (
    client_name, client_email, client_phone,
    event_date, event_type, event_address, guest_count, meal_type,
    status, categoria, admin_comments, original_timestamp
  ) VALUES (
    'Mouchlack Marine',
    'mouchlack.m@hotmail.com',
    '0684450354',
    '2025-10-31',
    'Anniversaire',
    '146 chemin fanton d’Andon biot ',
    '15',
    'null',
    'rejected',
    'null',
    'null',
    '18/09/2025 21:12:58'::timestamp
  );
INSERT INTO external_budgets (
    client_name, client_email, client_phone,
    event_date, event_type, event_address, guest_count, meal_type,
    status, categoria, admin_comments, original_timestamp
  ) VALUES (
    'claudy TOULAIGO',
    'claudy@sicpaca.fr',
    '0611555716',
    '2025-10-03',
    'Autre',
    '1100 RD 2085 06330 Roquefort les Pins ',
    '15',
    'null',
    'rejected',
    'null',
    'null',
    '20/09/2025 14:00:22'::timestamp
  );
INSERT INTO external_budgets (
    client_name, client_email, client_phone,
    event_date, event_type, event_address, guest_count, meal_type,
    status, categoria, admin_comments, original_timestamp
  ) VALUES (
    'Goncalves Carolina',
    'goncalvescarolina@live.fr',
    '0646118030',
    '2026-05-09',
    'Mariage',
    'Callas, Var ',
    '23',
    'null',
    'rejected',
    'null',
    'null',
    '20/09/2025 16:05:50'::timestamp
  );
INSERT INTO external_budgets (
    client_name, client_email, client_phone,
    event_date, event_type, event_address, guest_count, meal_type,
    status, categoria, admin_comments, original_timestamp
  ) VALUES (
    'Carsalade Manon',
    'manon.carsalade@hotmail.fr',
    '0638127496',
    '2026-09-19',
    'Mariage',
    'Domaine des sources, plan de coulomp, 04240 saint Benoît ',
    '60 dont 10 enfants/ados',
    'null',
    'rejected',
    'null',
    'null',
    '22/09/2025 10:43:01'::timestamp
  );
INSERT INTO external_budgets (
    client_name, client_email, client_phone,
    event_date, event_type, event_address, guest_count, meal_type,
    status, categoria, admin_comments, original_timestamp
  ) VALUES (
    'Coralie GILLI',
    'coralie.desvignes1995@gmail.com',
    '0644250001',
    '2025-11-22',
    'Anniversaire',
    'Boulevard maréchal Leclerc ',
    '40',
    'null',
    'rejected',
    'null',
    'null',
    '22/09/2025 20:11:08'::timestamp
  );
INSERT INTO external_budgets (
    client_name, client_email, client_phone,
    event_date, event_type, event_address, guest_count, meal_type,
    status, categoria, admin_comments, original_timestamp
  ) VALUES (
    'Mendes Tavares alex',
    'alexmendestavares@hotmail.com',
    '0665351115',
    '2027-08-14',
    'Mariage',
    'Levains ',
    '280',
    'null',
    'pending',
    'null',
    'null',
    '23/09/2025 15:00:11'::timestamp
  );
INSERT INTO external_budgets (
    client_name, client_email, client_phone,
    event_date, event_type, event_address, guest_count, meal_type,
    status, categoria, admin_comments, original_timestamp
  ) VALUES (
    'Ardino Kim',
    'kim.ardino@gmail.com',
    '0628358361',
    '2027-07-26',
    'Mariage',
    'Cabasse dans le Var ',
    '80',
    'null',
    'pending',
    'null',
    'null',
    '26/09/2025 13:37:47'::timestamp
  );
INSERT INTO external_budgets (
    client_name, client_email, client_phone,
    event_date, event_type, event_address, guest_count, meal_type,
    status, categoria, admin_comments, original_timestamp
  ) VALUES (
    'LESTREZ Mireille',
    'mireillelestrez@gmail.com',
    '0662446265',
    '2026-05-23',
    'Anniversaire',
    'La Ciotat (13600)',
    '120 adultes et 25 enfants',
    'null',
    'rejected',
    'null',
    'null',
    '28/09/2025 17:11:01'::timestamp
  );
INSERT INTO external_budgets (
    client_name, client_email, client_phone,
    event_date, event_type, event_address, guest_count, meal_type,
    status, categoria, admin_comments, original_timestamp
  ) VALUES (
    'Gensane Renaud ',
    'gensanerenaud@hotmail.com',
    '0613850596',
    '2026-08-28',
    'Autre',
    'Domaine de l’octopus draguignan',
    '80 adultes et 20 enfants',
    'null',
    'rejected',
    'null',
    'null',
    '30/09/2025 10:56:44'::timestamp
  );
INSERT INTO external_budgets (
    client_name, client_email, client_phone,
    event_date, event_type, event_address, guest_count, meal_type,
    status, categoria, admin_comments, original_timestamp
  ) VALUES (
    'DA SILVA FLAVIO',
    'flavio76160@gmail.com',
    '0783299077',
    '2026-06-27',
    'Mariage',
    'Hyères ',
    '100',
    'null',
    'pending',
    'null',
    'null',
    '30/09/2025 12:57:38'::timestamp
  );
INSERT INTO external_budgets (
    client_name, client_email, client_phone,
    event_date, event_type, event_address, guest_count, meal_type,
    status, categoria, admin_comments, original_timestamp
  ) VALUES (
    'Laugier Laura',
    'laura.laugier83@gmail.com',
    '0651633209',
    '2027-06-26',
    'Mariage',
    'Pourrières',
    '120',
    'null',
    'rejected',
    'null',
    'Manda mail con vajilla',
    '2/10/2025 9:15:55'::timestamp
  );
INSERT INTO external_budgets (
    client_name, client_email, client_phone,
    event_date, event_type, event_address, guest_count, meal_type,
    status, categoria, admin_comments, original_timestamp
  ) VALUES (
    'ribero sandra',
    'sandrambhair@gmail.com',
    '0672906314',
    '2026-07-14',
    'Autre',
    '119 CH DES RESTANQUES',
    '70',
    'null',
    'pending',
    'null',
    'null',
    '2/10/2025 22:59:52'::timestamp
  );
INSERT INTO external_budgets (
    client_name, client_email, client_phone,
    event_date, event_type, event_address, guest_count, meal_type,
    status, categoria, admin_comments, original_timestamp
  ) VALUES (
    'Agnello mike',
    'agnellomike2@gmail.com',
    '0613018001',
    '2026-08-29',
    'Baptême',
    'Chemin de tourris La Valette du var ',
    '160',
    'null',
    'pending',
    'null',
    'null',
    '3/10/2025 15:57:12'::timestamp
  );
INSERT INTO external_budgets (
    client_name, client_email, client_phone,
    event_date, event_type, event_address, guest_count, meal_type,
    status, categoria, admin_comments, original_timestamp
  ) VALUES (
    'Laurent Trabaud ',
    'rockyglic83@gmail.com',
    '0620595917',
    '2026-09-05',
    'Mariage',
    'Toulon',
    '100',
    'null',
    'pending',
    'null',
    'null',
    '3/10/2025 19:29:59'::timestamp
  );
INSERT INTO external_budgets (
    client_name, client_email, client_phone,
    event_date, event_type, event_address, guest_count, meal_type,
    status, categoria, admin_comments, original_timestamp
  ) VALUES (
    'Widiez Camille ',
    'camille.widiez@outlook.fr',
    '782360647',
    '2025-10-11',
    'Anniversaire',
    'Domaine de Glandève 04320 Entrevaux ',
    '35',
    'null',
    'rejected',
    'null',
    'null',
    '4/10/2025 14:31:16'::timestamp
  );
INSERT INTO external_budgets (
    client_name, client_email, client_phone,
    event_date, event_type, event_address, guest_count, meal_type,
    status, categoria, admin_comments, original_timestamp
  ) VALUES (
    'Lisetti Livier ',
    'livier.lisetti@gmail.com',
    '0617200075',
    '2025-10-31',
    'Autre',
    '06200 Nice ',
    '30',
    'null',
    'rejected',
    'null',
    'null',
    '6/10/2025 20:32:33'::timestamp
  );
INSERT INTO external_budgets (
    client_name, client_email, client_phone,
    event_date, event_type, event_address, guest_count, meal_type,
    status, categoria, admin_comments, original_timestamp
  ) VALUES (
    'Charlotte',
    'chaverborg@gmail.com',
    '0689871883',
    '2026-07-04',
    'Anniversaire',
    'Montmeyan,',
    '120',
    'null',
    'rejected',
    'null',
    'null',
    '7/10/2025 16:22:28'::timestamp
  );
INSERT INTO external_budgets (
    client_name, client_email, client_phone,
    event_date, event_type, event_address, guest_count, meal_type,
    status, categoria, admin_comments, original_timestamp
  ) VALUES (
    'Nicolas Haffner',
    'nicolas.hbfs@gmail.com',
    '0669672093',
    '2025-12-14',
    'Mariage',
    '1 allée San Pedro 83700 Saint Raphaël ',
    '26',
    'null',
    'rejected',
    'null',
    'null',
    '10/10/2025 13:47:59'::timestamp
  );
INSERT INTO external_budgets (
    client_name, client_email, client_phone,
    event_date, event_type, event_address, guest_count, meal_type,
    status, categoria, admin_comments, original_timestamp
  ) VALUES (
    'Victoria Kamp ',
    'vicyot.wedding@gmail.com',
    '0689971371',
    '2026-06-06',
    'Mariage',
    'Domaine de la Mayonette, La Crau',
    '75-85',
    'null',
    'pending',
    'null',
    'null',
    '11/10/2025 14:15:00'::timestamp
  );
INSERT INTO external_budgets (
    client_name, client_email, client_phone,
    event_date, event_type, event_address, guest_count, meal_type,
    status, categoria, admin_comments, original_timestamp
  ) VALUES (
    'Diani Toni ',
    'tonimougins@gmail.com',
    '0686515155',
    '2026-07-11',
    'Mariage',
    'Roquefort les pins',
    '70',
    'null',
    'pending',
    'null',
    'null',
    '11/10/2025 19:34:18'::timestamp
  );
INSERT INTO external_budgets (
    client_name, client_email, client_phone,
    event_date, event_type, event_address, guest_count, meal_type,
    status, categoria, admin_comments, original_timestamp
  ) VALUES (
    'Povoas Sandy',
    'sandy_povoas@hotmail.com',
    '+352 691952707',
    '2026-07-28',
    'Mariage',
    'Domaine des Maillettes',
    '65',
    'null',
    'pending',
    'null',
    'null',
    '19/10/2025 11:11:04'::timestamp
  );
INSERT INTO external_budgets (
    client_name, client_email, client_phone,
    event_date, event_type, event_address, guest_count, meal_type,
    status, categoria, admin_comments, original_timestamp
  ) VALUES (
    'HEYSCH Cindy',
    'cindy1315@hotmail.fr',
    '0644308482',
    '2025-11-16',
    'Anniversaire',
    '1406 Chemin Du Serrier 13, Villa Eole',
    '30',
    'null',
    'rejected',
    'null',
    'null',
    '19/10/2025 18:23:27'::timestamp
  );
INSERT INTO external_budgets (
    client_name, client_email, client_phone,
    event_date, event_type, event_address, guest_count, meal_type,
    status, categoria, admin_comments, original_timestamp
  ) VALUES (
    'Jimenez Emmanuelle ',
    'emmanuelle.jimenez@gmail.com',
    '0781247617',
    '2026-06-27',
    'Mariage',
    'La colle sur loup',
    '50',
    'null',
    'rejected',
    'null',
    'null',
    '20/10/2025 22:46:24'::timestamp
  );
INSERT INTO external_budgets (
    client_name, client_email, client_phone,
    event_date, event_type, event_address, guest_count, meal_type,
    status, categoria, admin_comments, original_timestamp
  ) VALUES (
    'POZZATTI Caroline ',
    'cpozzatti@hotmail.fr',
    '0623950278',
    '2026-07-18',
    'Mariage',
    'Domaine Glandeve à entrevaux ',
    '70',
    'null',
    'accepted',
    'null',
    'null',
    '21/10/2025 20:36:46'::timestamp
  );
INSERT INTO external_budgets (
    client_name, client_email, client_phone,
    event_date, event_type, event_address, guest_count, meal_type,
    status, categoria, admin_comments, original_timestamp
  ) VALUES (
    'Moal',
    'pascale.moal@icloud.com',
    '0685373728',
    '2026-06-27',
    'Anniversaire',
    'Sospel (domaine Sté Michel) 1 route de Sté Maie impasse du Fustet',
    '90 personnes',
    'null',
    'rejected',
    'null',
    'null',
    '22/10/2025 20:48:35'::timestamp
  );
INSERT INTO external_budgets (
    client_name, client_email, client_phone,
    event_date, event_type, event_address, guest_count, meal_type,
    status, categoria, admin_comments, original_timestamp
  ) VALUES (
    'Alice Cherprenet ',
    'alice.cherprenet@gmail.com',
    '0651100708',
    '2026-09-12',
    'Mariage',
    'Besse sur Issole (83)',
    '28 adultes + 5 enfants ',
    'null',
    'pending',
    'null',
    'null',
    '23/10/2025 21:22:04'::timestamp
  );
INSERT INTO external_budgets (
    client_name, client_email, client_phone,
    event_date, event_type, event_address, guest_count, meal_type,
    status, categoria, admin_comments, original_timestamp
  ) VALUES (
    'Alexandre d’izarny-gagas',
    'ccbnice@gmail.com',
    '0651836541',
    '2027-09-04',
    'Mariage',
    '400 impasse chapelle st etienne 83890 besse sur issole',
    '36',
    'null',
    'pending',
    'null',
    'null',
    '26/10/2025 6:53:11'::timestamp
  );
INSERT INTO external_budgets (
    client_name, client_email, client_phone,
    event_date, event_type, event_address, guest_count, meal_type,
    status, categoria, admin_comments, original_timestamp
  ) VALUES (
    'Vigne Anne-Sophie ',
    'asbvigne@gmail.com',
    '0616381761',
    '2025-11-14',
    'Anniversaire',
    'Cagnes ',
    '20',
    'null',
    'pending',
    'null',
    'null',
    '26/10/2025 10:14:36'::timestamp
  );
INSERT INTO external_budgets (
    client_name, client_email, client_phone,
    event_date, event_type, event_address, guest_count, meal_type,
    status, categoria, admin_comments, original_timestamp
  ) VALUES (
    'Doré Emmanuelle ',
    'emmanuelle130818@gmail.com',
    '0618027343',
    '2027-10-16',
    'Mariage',
    'Domaine des courmettes',
    '60',
    'null',
    'pending',
    'null',
    'null',
    '26/10/2025 19:00:12'::timestamp
  );
INSERT INTO external_budgets (
    client_name, client_email, client_phone,
    event_date, event_type, event_address, guest_count, meal_type,
    status, categoria, admin_comments, original_timestamp
  ) VALUES (
    'coquet celine',
    'c.coquet83@gmail.com',
    '0643540159',
    '2026-02-01',
    'Anniversaire',
    '151 impasse des cigales 83890 besse sur issole',
    '35 adultes 9 enfants',
    'null',
    'rejected',
    'null',
    'null',
    '27/10/2025 12:38:22'::timestamp
  );
INSERT INTO external_budgets (
    client_name, client_email, client_phone,
    event_date, event_type, event_address, guest_count, meal_type,
    status, categoria, admin_comments, original_timestamp
  ) VALUES (
    'Schmidt Elsa ',
    'elsaa.schmidt9096@gmail.com',
    '0661557868',
    '2027-10-16',
    'Mariage',
    'Sorgues/ alentour',
    '130/140',
    'null',
    'rejected',
    'null',
    'null',
    '28/10/2025 17:07:56'::timestamp
  );
INSERT INTO external_budgets (
    client_name, client_email, client_phone,
    event_date, event_type, event_address, guest_count, meal_type,
    status, categoria, admin_comments, original_timestamp
  ) VALUES (
    'Victor Ursu',
    'boha.92.92@gmail.com',
    '0679211591',
    '2026-08-05',
    'Mariage',
    'Alpes Maritimes ',
    '50-60',
    'null',
    'pending',
    'null',
    'null',
    '28/10/2025 23:40:33'::timestamp
  );
INSERT INTO external_budgets (
    client_name, client_email, client_phone,
    event_date, event_type, event_address, guest_count, meal_type,
    status, categoria, admin_comments, original_timestamp
  ) VALUES (
    'SAMPO Solène',
    'solene.sampo98@gmail.com',
    '0686998355',
    '2026-09-18',
    'Mariage',
    'la bastide de fangousse ',
    '45',
    'null',
    'rejected',
    'null',
    'null',
    '29/10/2025 20:21:08'::timestamp
  );
INSERT INTO external_budgets (
    client_name, client_email, client_phone,
    event_date, event_type, event_address, guest_count, meal_type,
    status, categoria, admin_comments, original_timestamp
  ) VALUES (
    'Deborah Achard de la vente ',
    'deborah.dao95@gmail.com',
    '0618913535',
    '2026-05-24',
    'Baptême',
    '150 chemin des carreiros 83440 Tanneron ',
    '20 en comptant les enfants ',
    'null',
    'pending',
    'null',
    'null',
    '30/10/2025 19:36:04'::timestamp
  );
INSERT INTO external_budgets (
    client_name, client_email, client_phone,
    event_date, event_type, event_address, guest_count, meal_type,
    status, categoria, admin_comments, original_timestamp
  ) VALUES (
    'Anelli Laurent ',
    'l.anelli06@gmail.com',
    '0622132448',
    '2026-07-18',
    'Mariage',
    'Inconnu encore au plus dans le Var ',
    '90+15enfants',
    'null',
    'rejected',
    'null',
    'null',
    '1/11/2025 16:15:20'::timestamp
  );
INSERT INTO external_budgets (
    client_name, client_email, client_phone,
    event_date, event_type, event_address, guest_count, meal_type,
    status, categoria, admin_comments, original_timestamp
  ) VALUES (
    'Helmer Maud ',
    'helmermaud@outlook.fr',
    '0660474414',
    '2026-07-18',
    'Anniversaire',
    '3868 Route de Courmettes 06140 tourrettes sur loup ',
    '40/50',
    'null',
    'rejected',
    'null',
    'null',
    '3/11/2025 19:38:59'::timestamp
  );
INSERT INTO external_budgets (
    client_name, client_email, client_phone,
    event_date, event_type, event_address, guest_count, meal_type,
    status, categoria, admin_comments, original_timestamp
  ) VALUES (
    'Maurel Morgane ',
    'maurelmorgane@hotmail.fr',
    '0667833637',
    '2027-04-21',
    'Mariage',
    'Domaine de Vaucouleurs, 83480 Puget-sur-Argens',
    '80',
    'null',
    'pending',
    'null',
    'null',
    '4/11/2025 11:39:07'::timestamp
  );
INSERT INTO external_budgets (
    client_name, client_email, client_phone,
    event_date, event_type, event_address, guest_count, meal_type,
    status, categoria, admin_comments, original_timestamp
  ) VALUES (
    'miceli estelle',
    'miceliestelle@outlook.com',
    '0621084419',
    '2026-09-05',
    'Baptême',
    '1127 route de la roquette',
    '125',
    'null',
    'pending',
    'null',
    'null',
    '5/11/2025 12:40:26'::timestamp
  );
INSERT INTO external_budgets (
    client_name, client_email, client_phone,
    event_date, event_type, event_address, guest_count, meal_type,
    status, categoria, admin_comments, original_timestamp
  ) VALUES (
    'Adeline DUVAL',
    'adeline.duval77@gmail.com',
    '0667441374',
    '2026-06-27',
    'Mariage',
    'Neoules',
    '44',
    'null',
    'pending',
    'null',
    'null',
    '5/11/2025 16:19:44'::timestamp
  );
INSERT INTO external_budgets (
    client_name, client_email, client_phone,
    event_date, event_type, event_address, guest_count, meal_type,
    status, categoria, admin_comments, original_timestamp
  ) VALUES (
    'Sapey julien',
    'juliensapey@gmail.com',
    '0625056942',
    '2026-08-22',
    'Mariage',
    'Bonson',
    '40',
    'null',
    'pending',
    'null',
    'null',
    '5/11/2025 16:49:43'::timestamp
  );
INSERT INTO external_budgets (
    client_name, client_email, client_phone,
    event_date, event_type, event_address, guest_count, meal_type,
    status, categoria, admin_comments, original_timestamp
  ) VALUES (
    'CAROVANI Arnaud',
    'carovarnaud@hotmail.com',
    '0672221881',
    '2026-07-11',
    'Baptême',
    'carros 06510',
    '100',
    'null',
    'pending',
    'null',
    'null',
    '6/11/2025 13:37:46'::timestamp
  );
INSERT INTO external_budgets (
    client_name, client_email, client_phone,
    event_date, event_type, event_address, guest_count, meal_type,
    status, categoria, admin_comments, original_timestamp
  ) VALUES (
    'DELAGE Thomas ',
    'delagethomas@outlook.fr',
    '0629078830',
    '2026-09-05',
    'Baptême',
    '56 chemin des castors 06130 grasse',
    '80',
    'null',
    'pending',
    'null',
    'null',
    '7/11/2025 12:35:21'::timestamp
  );
INSERT INTO external_budgets (
    client_name, client_email, client_phone,
    event_date, event_type, event_address, guest_count, meal_type,
    status, categoria, admin_comments, original_timestamp
  ) VALUES (
    'Francois Manon',
    'francois.manon@live.fr',
    '+31627185627',
    '2026-06-13',
    'Autre',
    'Lauris 84360',
    '50',
    'null',
    'rejected',
    'null',
    'null',
    '8/11/2025 22:28:46'::timestamp
  );
INSERT INTO external_budgets (
    client_name, client_email, client_phone,
    event_date, event_type, event_address, guest_count, meal_type,
    status, categoria, admin_comments, original_timestamp
  ) VALUES (
    'Wendling jennifer ',
    'jenniferwdlg@gmail.com',
    '0765243592',
    '2026-09-12',
    'Mariage',
    'Gréolières ',
    '35',
    'null',
    'pending',
    'null',
    'null',
    '10/11/2025 18:46:44'::timestamp
  );
INSERT INTO external_budgets (
    client_name, client_email, client_phone,
    event_date, event_type, event_address, guest_count, meal_type,
    status, categoria, admin_comments, original_timestamp
  ) VALUES (
    'Chalmeigné Marc',
    'marcchal66@gmail.com',
    '00362621260430',
    '2026-07-11',
    'Anniversaire',
    'Biot',
    '60/70',
    'null',
    'pending',
    'null',
    'null',
    '11/11/2025 20:44:34'::timestamp
  );
INSERT INTO external_budgets (
    client_name, client_email, client_phone,
    event_date, event_type, event_address, guest_count, meal_type,
    status, categoria, admin_comments, original_timestamp
  ) VALUES (
    'Pons Clara ',
    'pons.claraa@gmail.com',
    '0682249863',
    '2027-08-04',
    'Mariage',
    '1062 vieux chemin de Cagnes à la gaude ',
    '70',
    'null',
    'pending',
    'null',
    'null',
    '13/11/2025 15:19:29'::timestamp
  );
INSERT INTO external_budgets (
    client_name, client_email, client_phone,
    event_date, event_type, event_address, guest_count, meal_type,
    status, categoria, admin_comments, original_timestamp
  ) VALUES (
    'Mahlinger Fabrice ',
    'mahlingerfabice@gmail.com',
    '0688394368',
    '2026-07-11',
    'Mariage',
    'Carros',
    '70',
    'null',
    'pending',
    'null',
    'null',
    '15/11/2025 14:34:14'::timestamp
  );
INSERT INTO external_budgets (
    client_name, client_email, client_phone,
    event_date, event_type, event_address, guest_count, meal_type,
    status, categoria, admin_comments, original_timestamp
  ) VALUES (
    'Brizot manon',
    'm.brizot@yahoo.fr',
    '0666934341',
    '2027-04-24',
    'Mariage',
    'Le thoronet ',
    '43 adultes et 5 enfants et 3 prestataires ',
    'null',
    'pending',
    'null',
    'null',
    '15/11/2025 19:42:24'::timestamp
  );
INSERT INTO external_budgets (
    client_name, client_email, client_phone,
    event_date, event_type, event_address, guest_count, meal_type,
    status, categoria, admin_comments, original_timestamp
  ) VALUES (
    'Laura Murciano ',
    'murcianolaura38@gmail.com',
    '0695291528',
    '2026-09-25',
    'Mariage',
    'Les terres de saint hilaire ',
    '60',
    'null',
    'pending',
    'null',
    'null',
    '16/11/2025 10:50:28'::timestamp
  );
INSERT INTO external_budgets (
    client_name, client_email, client_phone,
    event_date, event_type, event_address, guest_count, meal_type,
    status, categoria, admin_comments, original_timestamp
  ) VALUES (
    'Marie Penalba',
    'mariepenalba@gmail.com',
    '0767850416',
    '2025-04-25',
    'Anniversaire',
    '501 route de la Baronne 06700 Saint Laurent du Var',
    '27',
    'null',
    'pending',
    'null',
    'null',
    '16/11/2025 21:16:04'::timestamp
  );
INSERT INTO external_budgets (
    client_name, client_email, client_phone,
    event_date, event_type, event_address, guest_count, meal_type,
    status, categoria, admin_comments, original_timestamp
  ) VALUES (
    'Legrand Negrita ',
    'tahirovska@hotmail.com',
    '0769815416',
    '2026-08-07',
    'Mariage',
    'Dans le 06 ',
    '100',
    'null',
    'pending',
    'null',
    'null',
    '16/11/2025 23:47:10'::timestamp
  );
INSERT INTO external_budgets (
    client_name, client_email, client_phone,
    event_date, event_type, event_address, guest_count, meal_type,
    status, categoria, admin_comments, original_timestamp
  ) VALUES (
    'TOMAC Lilone',
    'lilone.tomac@gmail.com',
    '0786834891',
    '2026-05-02',
    'Baptême',
    'Saint Martin du Var',
    '50',
    'null',
    'rejected',
    'null',
    'null',
    '17/11/2025 9:21:27'::timestamp
  );
INSERT INTO external_budgets (
    client_name, client_email, client_phone,
    event_date, event_type, event_address, guest_count, meal_type,
    status, categoria, admin_comments, original_timestamp
  ) VALUES (
    'ALBERGUCCI Marc',
    'marc.albergucci@olifangroup.com',
    '0613504758',
    '2025-12-18',
    'Corporatif',
    '609 Route de la roquette 06250 Mougins',
    '22',
    'null',
    'accepted',
    'null',
    'null',
    '17/11/2025 11:40:12'::timestamp
  );
INSERT INTO external_budgets (
    client_name, client_email, client_phone,
    event_date, event_type, event_address, guest_count, meal_type,
    status, categoria, admin_comments, original_timestamp
  ) VALUES (
    'Defert Camille',
    'camille.defert08@gmail.com',
    '0611860319',
    '2027-06-12',
    'Mariage',
    'Côte d’Azur/ Corse',
    'Environ 70',
    'null',
    'pending',
    'null',
    'null',
    '17/11/2025 19:49:38'::timestamp
  );
INSERT INTO external_budgets (
    client_name, client_email, client_phone,
    event_date, event_type, event_address, guest_count, meal_type,
    status, categoria, admin_comments, original_timestamp
  ) VALUES (
    'Batt Cindy ',
    'marli.haag@gmail.com',
    '0612355041',
    '2026-07-11',
    'Mariage',
    'Domaine Nais à rognes ',
    '70 a l’apéro et 55 adultes au repas +10 enfants ',
    'null',
    'rejected',
    'null',
    'null',
    '17/11/2025 21:45:26'::timestamp
  );
INSERT INTO external_budgets (
    client_name, client_email, client_phone,
    event_date, event_type, event_address, guest_count, meal_type,
    status, categoria, admin_comments, original_timestamp
  ) VALUES (
    'Lisa Duterte',
    'lisa.duterte@hotmail.fr',
    '0665388642',
    '2026-09-19',
    'Mariage',
    '1210 avenue du levant 83980 le lavandou',
    '83 adultes 6 enfants + 2 de 2 et 3 ans',
    'null',
    'pending',
    'null',
    'null',
    '18/11/2025 8:59:14'::timestamp
  );
INSERT INTO external_budgets (
    client_name, client_email, client_phone,
    event_date, event_type, event_address, guest_count, meal_type,
    status, categoria, admin_comments, original_timestamp
  ) VALUES (
    'Grela Marie ',
    'marie.grela@hotmail.com',
    '0769365365',
    '2026-08-08',
    'Mariage',
    'Istres',
    '60',
    'null',
    'rejected',
    'null',
    'null',
    '19/11/2025 20:04:53'::timestamp
  );
INSERT INTO external_budgets (
    client_name, client_email, client_phone,
    event_date, event_type, event_address, guest_count, meal_type,
    status, categoria, admin_comments, original_timestamp
  ) VALUES (
    'Susana Da Silva ',
    'susy20_silva@hotmail.com',
    '0686182224',
    '2026-05-02',
    'Mariage',
    '174 Zone D Activités Les Plaines sud 13250 Saint chamas ',
    '70',
    'null',
    'rejected',
    'null',
    'null',
    '20/11/2025 16:22:30'::timestamp
  );
INSERT INTO external_budgets (
    client_name, client_email, client_phone,
    event_date, event_type, event_address, guest_count, meal_type,
    status, categoria, admin_comments, original_timestamp
  ) VALUES (
    'Castiglione romain',
    'romain.castiglione91@gmail.com',
    '0622516478',
    '2026-09-26',
    'Mariage',
    'Chemine de paradis, Eyguieres',
    '100',
    'null',
    'pending',
    'null',
    'null',
    '20/11/2025 17:37:25'::timestamp
  );
INSERT INTO external_budgets (
    client_name, client_email, client_phone,
    event_date, event_type, event_address, guest_count, meal_type,
    status, categoria, admin_comments, original_timestamp
  ) VALUES (
    'Balezo Stéphane et Nathalie ',
    'nathalie.s72@hotmail.fr',
    '0629220138',
    '2026-09-19',
    'Mariage',
    'Pas encore défini ',
    '70',
    'null',
    'pending',
    'null',
    'null',
    '20/11/2025 17:45:45'::timestamp
  );
INSERT INTO external_budgets (
    client_name, client_email, client_phone,
    event_date, event_type, event_address, guest_count, meal_type,
    status, categoria, admin_comments, original_timestamp
  ) VALUES (
    'Giroudon Nathalie ',
    'nathaliegiroudon@gmail.com',
    '06 81 08 08 89 ',
    '2026-06-06',
    'Mariage',
    'Jouques',
    '85',
    'null',
    'pending',
    'null',
    'null',
    '20/11/2025 22:23:51'::timestamp
  );
INSERT INTO external_budgets (
    client_name, client_email, client_phone,
    event_date, event_type, event_address, guest_count, meal_type,
    status, categoria, admin_comments, original_timestamp
  ) VALUES (
    'Correia marina',
    'correia.marina.mc@gmail.com',
    '0658841596',
    '2026-07-25',
    'Mariage',
    'Route de la maura 06500 gorbio',
    '60',
    'null',
    'pending',
    'null',
    'null',
    '20/11/2025 22:33:52'::timestamp
  );
INSERT INTO external_budgets (
    client_name, client_email, client_phone,
    event_date, event_type, event_address, guest_count, meal_type,
    status, categoria, admin_comments, original_timestamp
  ) VALUES (
    'Guastavi laurent',
    'gusthai@hotmail.com',
    '0628228188',
    '2026-06-06',
    'Anniversaire',
    '33 CHEMIN DE SAINT MARC',
    '20',
    'null',
    'rejected',
    'null',
    'null',
    '21/11/2025 18:14:29'::timestamp
  );
INSERT INTO external_budgets (
    client_name, client_email, client_phone,
    event_date, event_type, event_address, guest_count, meal_type,
    status, categoria, admin_comments, original_timestamp
  ) VALUES (
    'Beltramone Corinne ',
    'corinnebeltramone@gmail.com',
    '0679584982',
    '2026-08-28',
    'Mariage',
    'Aspremont ',
    '31',
    'null',
    'pending',
    'null',
    'null',
    '21/11/2025 19:29:55'::timestamp
  );
INSERT INTO external_budgets (
    client_name, client_email, client_phone,
    event_date, event_type, event_address, guest_count, meal_type,
    status, categoria, admin_comments, original_timestamp
  ) VALUES (
    'Tempier manon',
    'manontempier@gmail.com',
    '0628937763',
    '2026-10-17',
    'Mariage',
    'Salle des fetes de Caderousse 84860',
    '70',
    'null',
    'rejected',
    'null',
    'lejos',
    '22/11/2025 11:55:23'::timestamp
  );
INSERT INTO external_budgets (
    client_name, client_email, client_phone,
    event_date, event_type, event_address, guest_count, meal_type,
    status, categoria, admin_comments, original_timestamp
  ) VALUES (
    'FABIEN Guillaume',
    'guifabien84170@gmail.com',
    '0633117830',
    '2026-07-25',
    'Mariage',
    '1304 chemin de saint gens ',
    '60',
    'null',
    'rejected',
    'null',
    'lejos',
    '22/11/2025 19:40:15'::timestamp
  );
INSERT INTO external_budgets (
    client_name, client_email, client_phone,
    event_date, event_type, event_address, guest_count, meal_type,
    status, categoria, admin_comments, original_timestamp
  ) VALUES (
    'Tessa Boudal',
    'tessa.boudal@gmail.com',
    '0667347505',
    '2026-05-30',
    'Mariage',
    'Villa des Amandiers, 260 Route du Pin Montard  BP 20066  - 06 902 Sophia Antipolis Cedex',
    '70 - 80',
    'null',
    'pending',
    'null',
    'null',
    '22/11/2025 23:45:10'::timestamp
  );
INSERT INTO external_budgets (
    client_name, client_email, client_phone,
    event_date, event_type, event_address, guest_count, meal_type,
    status, categoria, admin_comments, original_timestamp
  ) VALUES (
    'Juliette arvisey',
    'jujusbh@me.com',
    '0608278705',
    '2027-10-04',
    'Mariage',
    'Dans le var ',
    '90',
    'null',
    'pending',
    'null',
    'null',
    '23/11/2025 19:36:33'::timestamp
  );
INSERT INTO external_budgets (
    client_name, client_email, client_phone,
    event_date, event_type, event_address, guest_count, meal_type,
    status, categoria, admin_comments, original_timestamp
  ) VALUES (
    'Lim Khim ',
    'achats@europtp.fr',
    '0662342152',
    '2025-12-21',
    'Anniversaire',
    '18 allée des chênes 06510 Gattieres ',
    '30',
    'null',
    'rejected',
    'null',
    'null',
    '24/11/2025 8:15:26'::timestamp
  );
INSERT INTO external_budgets (
    client_name, client_email, client_phone,
    event_date, event_type, event_address, guest_count, meal_type,
    status, categoria, admin_comments, original_timestamp
  ) VALUES (
    'Junqua Franck',
    'hyunkell@msn.com',
    '0602132943',
    '2025-12-31',
    'Autre',
    '735 avenue du gold, Fréjus',
    '25',
    'null',
    'rejected',
    'null',
    'null',
    '24/11/2025 11:11:04'::timestamp
  );
INSERT INTO external_budgets (
    client_name, client_email, client_phone,
    event_date, event_type, event_address, guest_count, meal_type,
    status, categoria, admin_comments, original_timestamp
  ) VALUES (
    'Ciais Virginie ',
    'vvj1005@gmail.com',
    '0681959151',
    '2027-06-19',
    'Mariage',
    'Guillaumes ',
    '70',
    'null',
    'pending',
    'null',
    'null',
    '24/11/2025 15:28:36'::timestamp
  );
INSERT INTO external_budgets (
    client_name, client_email, client_phone,
    event_date, event_type, event_address, guest_count, meal_type,
    status, categoria, admin_comments, original_timestamp
  ) VALUES (
    'Saint-Martin Yann ',
    'stmartin.yann@gmail.com',
    '0698226595',
    '2026-07-19',
    'Autre',
    'Pourrieres Var 83910',
    'Env 30',
    'null',
    'pending',
    'null',
    'null',
    '24/11/2025 22:06:03'::timestamp
  );
INSERT INTO external_budgets (
    client_name, client_email, client_phone,
    event_date, event_type, event_address, guest_count, meal_type,
    status, categoria, admin_comments, original_timestamp
  ) VALUES (
    'Delaplace Angélique ',
    'pompiergirl@hotmail.fr',
    '06.81.98.55.11 ',
    '2026-08-08',
    'Mariage',
    'Roquebilliere 06450',
    '60',
    'null',
    'pending',
    'null',
    'null',
    '25/11/2025 10:52:02'::timestamp
  );
INSERT INTO external_budgets (
    client_name, client_email, client_phone,
    event_date, event_type, event_address, guest_count, meal_type,
    status, categoria, admin_comments, original_timestamp
  ) VALUES (
    'Nikiema François',
    'francoisdesales.nikiema@tse.energy',
    '0660753661',
    '2025-12-19',
    'Corporatif',
    '25 allée Pierre Ziller, 06560 Valbonne. Société TSE',
    '67',
    'null',
    'rejected',
    'null',
    'null',
    '26/11/2025 9:07:29'::timestamp
  );
INSERT INTO external_budgets (
    client_name, client_email, client_phone,
    event_date, event_type, event_address, guest_count, meal_type,
    status, categoria, admin_comments, original_timestamp
  ) VALUES (
    'chloe bidikian',
    'chloe.smoglers@gmail.com',
    '0649477851',
    '2026-07-25',
    'Mariage',
    'La valette du var',
    '35',
    'null',
    'rejected',
    'null',
    'null',
    '26/11/2025 19:10:35'::timestamp
  );
INSERT INTO external_budgets (
    client_name, client_email, client_phone,
    event_date, event_type, event_address, guest_count, meal_type,
    status, categoria, admin_comments, original_timestamp
  ) VALUES (
    'Pfister sylvie',
    'sylviepfister83@gmail.com',
    '0784592088',
    '2026-05-30',
    'Mariage',
    'Domaine Astra à Grans',
    '40',
    'null',
    'pending',
    'null',
    'null',
    '27/11/2025 20:29:53'::timestamp
  );
INSERT INTO external_budgets (
    client_name, client_email, client_phone,
    event_date, event_type, event_address, guest_count, meal_type,
    status, categoria, admin_comments, original_timestamp
  ) VALUES (
    'Moletto Mélanie ',
    'melanie.moletto@hotmail.fr',
    '0665978883',
    '2026-05-23',
    'Baptême',
    'Olivetta san Michele a 25 min de Sospel ',
    '70',
    'null',
    'pending',
    'null',
    'null',
    '1/12/2025 12:13:01'::timestamp
  );
INSERT INTO external_budgets (
    client_name, client_email, client_phone,
    event_date, event_type, event_address, guest_count, meal_type,
    status, categoria, admin_comments, original_timestamp
  ) VALUES (
    'Thion Laureen ',
    'lthion69@gmail.com',
    '0616559124',
    '2026-09-05',
    'Mariage',
    '151 routes de colomars a nice 06200',
    '70 et 80 personnes ',
    'null',
    'pending',
    'null',
    'null',
    '2/12/2025 20:49:46'::timestamp
  );
INSERT INTO external_budgets (
    client_name, client_email, client_phone,
    event_date, event_type, event_address, guest_count, meal_type,
    status, categoria, admin_comments, original_timestamp
  ) VALUES (
    'Barnier Régis ',
    'regisbarnier12@gmail.com',
    '0755773644',
    '2028-06-17',
    'Anniversaire',
    '2 bis rue Ferdinand pillet Marignane',
    'Entre 50 et 60 personnes',
    'null',
    'rejected',
    'null',
    'null',
    '3/12/2025 8:25:15'::timestamp
  );
INSERT INTO external_budgets (
    client_name, client_email, client_phone,
    event_date, event_type, event_address, guest_count, meal_type,
    status, categoria, admin_comments, original_timestamp
  ) VALUES (
    'Sylvie Mandic',
    'sylvie@laporte.biz',
    '04 93 65 77 71 ',
    '2025-12-19',
    'Corporatif',
    'Société Laporte 371 chemin des pres 06410 Biot ',
    '35',
    'null',
    'rejected',
    'null',
    'null',
    '3/12/2025 17:13:44'::timestamp
  );
INSERT INTO external_budgets (
    client_name, client_email, client_phone,
    event_date, event_type, event_address, guest_count, meal_type,
    status, categoria, admin_comments, original_timestamp
  ) VALUES (
    'Kintz Coralie ',
    'c.kintz@live.fr',
    '0687910920',
    '2026-09-26',
    'Mariage',
    '3 rue Pablo Picasso 13920 St mitre les remparts ',
    '65',
    'null',
    'rejected',
    'null',
    'null',
    '3/12/2025 22:23:59'::timestamp
  );
INSERT INTO external_budgets (
    client_name, client_email, client_phone,
    event_date, event_type, event_address, guest_count, meal_type,
    status, categoria, admin_comments, original_timestamp
  ) VALUES (
    'JELEZKOFF justine',
    'juju8388@hotmail.fr',
    '0623591246',
    '2026-08-25',
    'Mariage',
    'Non défini',
    '70',
    'null',
    'pending',
    'null',
    'null',
    '4/12/2025 12:38:08'::timestamp
  );
INSERT INTO external_budgets (
    client_name, client_email, client_phone,
    event_date, event_type, event_address, guest_count, meal_type,
    status, categoria, admin_comments, original_timestamp
  ) VALUES (
    'GERVAIS Lou',
    'lou.gervais41@gmail.com',
    '0644357882',
    '2025-06-27',
    'Mariage',
    '03160 SAINT PLAISIR',
    '30',
    'null',
    'rejected',
    'null',
    'null',
    '4/12/2025 19:45:12'::timestamp
  );
INSERT INTO external_budgets (
    client_name, client_email, client_phone,
    event_date, event_type, event_address, guest_count, meal_type,
    status, categoria, admin_comments, original_timestamp
  ) VALUES (
    'Pichot nicolas',
    'diwees@hotmail.fr',
    '0683271508',
    '2026-06-06',
    'Baptême',
    'Sollies Pont 83210',
    'Environ 70',
    'null',
    'pending',
    'null',
    'null',
    '4/12/2025 20:04:00'::timestamp
  );
INSERT INTO external_budgets (
    client_name, client_email, client_phone,
    event_date, event_type, event_address, guest_count, meal_type,
    status, categoria, admin_comments, original_timestamp
  ) VALUES (
    'Kada kaoutar',
    'kawtarkada211@gmail.com',
    '0623443624',
    '2026-09-05',
    'Mariage',
    'Aix en Provence ',
    '50 voir 55',
    'null',
    'rejected',
    'null',
    'null',
    '4/12/2025 21:01:47'::timestamp
  );
INSERT INTO external_budgets (
    client_name, client_email, client_phone,
    event_date, event_type, event_address, guest_count, meal_type,
    status, categoria, admin_comments, original_timestamp
  ) VALUES (
    'Segura Marie',
    'marie06670@hotmail.fr',
    '0646654458',
    '2027-09-25',
    'Mariage',
    'Salle des Fêtes Boulevard du Docteur SAUVY 06530 SPERACEDES',
    '80',
    'null',
    'pending',
    'null',
    'null',
    '5/12/2025 15:36:30'::timestamp
  );
INSERT INTO external_budgets (
    client_name, client_email, client_phone,
    event_date, event_type, event_address, guest_count, meal_type,
    status, categoria, admin_comments, original_timestamp
  ) VALUES (
    'Renaud Juliette',
    'ju17.r@hotmail.fr',
    '0609107604',
    '2026-01-31',
    'Anniversaire',
    'Tourettes sur Loup',
    '50',
    'null',
    'rejected',
    'null',
    'null',
    '5/12/2025 16:12:14'::timestamp
  );
INSERT INTO external_budgets (
    client_name, client_email, client_phone,
    event_date, event_type, event_address, guest_count, meal_type,
    status, categoria, admin_comments, original_timestamp
  ) VALUES (
    'Rousseau Aurélie ',
    'murmure.communication@gmail.com',
    '0665684548',
    '2027-05-05',
    'Mariage',
    '83470',
    '55',
    'null',
    'pending',
    'null',
    'null',
    '5/12/2025 16:34:59'::timestamp
  );
INSERT INTO external_budgets (
    client_name, client_email, client_phone,
    event_date, event_type, event_address, guest_count, meal_type,
    status, categoria, admin_comments, original_timestamp
  ) VALUES (
    'Charlaine pechon',
    'charlaine.pechon@live.fr',
    '0669343660',
    '2027-06-26',
    'Mariage',
    'Le mas des cinq Fontaines Sisteron',
    '75',
    'null',
    'rejected',
    'null',
    'null',
    '7/12/2025 15:19:30'::timestamp
  );
INSERT INTO external_budgets (
    client_name, client_email, client_phone,
    event_date, event_type, event_address, guest_count, meal_type,
    status, categoria, admin_comments, original_timestamp
  ) VALUES (
    'Ercilia camacho ',
    'camacho.ercilia@yahoo.fr',
    '06 17 24 46 34 ',
    '2026-08-28',
    'Mariage',
    'Pas définie',
    '50',
    'null',
    'pending',
    'null',
    'null',
    '7/12/2025 18:39:37'::timestamp
  );
INSERT INTO external_budgets (
    client_name, client_email, client_phone,
    event_date, event_type, event_address, guest_count, meal_type,
    status, categoria, admin_comments, original_timestamp
  ) VALUES (
    'TRUCHI Marine',
    'truchimarine@yahoo.com',
    '0611442305',
    '2026-07-25',
    'Mariage',
    '197 Chemin de Sidonie 06700 Saint Laurent du var',
    '80-100',
    'null',
    'pending',
    'null',
    'null',
    '8/12/2025 11:38:01'::timestamp
  );
INSERT INTO external_budgets (
    client_name, client_email, client_phone,
    event_date, event_type, event_address, guest_count, meal_type,
    status, categoria, admin_comments, original_timestamp
  ) VALUES (
    'SAEZ STEPHANIE',
    'adjoint-direction@stbnice.fr',
    '0688305870',
    '2026-06-06',
    'Autre',
    'MOUGINS',
    '50',
    'null',
    'pending',
    'null',
    'null',
    '9/12/2025 17:22:57'::timestamp
  );
INSERT INTO external_budgets (
    client_name, client_email, client_phone,
    event_date, event_type, event_address, guest_count, meal_type,
    status, categoria, admin_comments, original_timestamp
  ) VALUES (
    'Lou-Anne et Anthony ',
    'anthoetlouanne@gmail.com',
    '0786392121',
    '2027-05-01',
    'Mariage',
    'Domaine des courmettes Tourettes sur Loup',
    '80',
    'null',
    'pending',
    'null',
    'null',
    '9/12/2025 20:27:35'::timestamp
  );
INSERT INTO external_budgets (
    client_name, client_email, client_phone,
    event_date, event_type, event_address, guest_count, meal_type,
    status, categoria, admin_comments, original_timestamp
  ) VALUES (
    'Froment Delphine',
    'd.from@laposte.net',
    '0677348835',
    '2027-05-16',
    'Mariage',
    'Bastide de Fangouse à Entrecastaux ',
    '50',
    'null',
    'rejected',
    'null',
    'null',
    '9/12/2025 22:04:20'::timestamp
  );
INSERT INTO external_budgets (
    client_name, client_email, client_phone,
    event_date, event_type, event_address, guest_count, meal_type,
    status, categoria, admin_comments, original_timestamp
  ) VALUES (
    'Carla Paynaud ',
    'carlapaynaud@gmail.com',
    '0611933410',
    '2026-07-25',
    'Mariage',
    'Nice',
    'Environ 140',
    'null',
    'pending',
    'null',
    'null',
    '10/12/2025 14:36:03'::timestamp
  );
INSERT INTO external_budgets (
    client_name, client_email, client_phone,
    event_date, event_type, event_address, guest_count, meal_type,
    status, categoria, admin_comments, original_timestamp
  ) VALUES (
    'Dassonneville Chloe ',
    'chloedassonneville@outlook.fr',
    '0783085345',
    '2027-07-10',
    'Mariage',
    'Pélissanne 13330',
    '39 adultes et 23 enfants ',
    'null',
    'rejected',
    'null',
    'null',
    '10/12/2025 19:40:36'::timestamp
  );
INSERT INTO external_budgets (
    client_name, client_email, client_phone,
    event_date, event_type, event_address, guest_count, meal_type,
    status, categoria, admin_comments, original_timestamp
  ) VALUES (
    'BOUCHENY Jean Luc ',
    'jl.boucheny@gmail.com',
    '0662221774',
    '2026-07-07',
    'Mariage',
    'Var',
    '60',
    'null',
    'sent',
    'null',
    'null',
    '10/12/2025 19:45:03'::timestamp
  );
INSERT INTO external_budgets (
    client_name, client_email, client_phone,
    event_date, event_type, event_address, guest_count, meal_type,
    status, categoria, admin_comments, original_timestamp
  ) VALUES (
    'Challal Lydia ',
    'challalydia@gmail.com',
    '0626271525',
    '2026-05-23',
    'Mariage',
    'Roquevaire',
    '25',
    'null',
    'rejected',
    'null',
    'null',
    '11/12/2025 8:31:12'::timestamp
  );