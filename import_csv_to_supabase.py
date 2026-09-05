#!/usr/bin/env python3
import csv
import requests
import json
from datetime import datetime

# Configuration Supabase
SUPABASE_URL = "https://iaxkqzhqvxwtcmftvriy.supabase.co"
SUPABASE_KEY = "sb_publishable_sHHoDyI1epMxyadImC69nA_b7qcyyiv"
TABLE_NAME = "base_connaissance"

# Headers pour les requêtes
headers = {
    "apikey": SUPABASE_KEY,
    "Content-Type": "application/json",
    "Authorization": f"Bearer {SUPABASE_KEY}"
}

def create_table():
    """Créer la table dans Supabase si elle n'existe pas"""
    print("📋 Vérification de la table Supabase...")
    
    # Pour créer une table, nous utilisons l'API REST
    # Mais c'est plus facile via le dashboard
    print("⚠️ Créer manuellement la table dans Supabase avec ces colonnes :")
    print("""
    - id (UUID, primary key, auto-generated)
    - nom (text)
    - note_alex (text, nullable)
    - texte (text, nullable)
    - url (text, nullable)
    - date_mise_a_jour_n8n (text, nullable)
    - etiquettes (text, nullable)
    - created_at (timestamp, auto-generated)
    """)
    
    return True

def import_csv_to_supabase():
    """Importer le CSV dans Supabase"""
    csv_path = "/Users/GG_1/Desktop/Techday2/base de connaissance.csv"
    
    print(f"\n📂 Lecture du fichier : {csv_path}")
    
    rows = []
    with open(csv_path, 'r', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        for i, row in enumerate(reader):
            # Nettoyage des données
            clean_row = {
                "nom": row.get("Nom", "").strip() or None,
                "note_alex": row.get("Note Alex", "").strip() or None,
                "texte": row.get("Texte", "").strip() or None,
                "url": row.get("URL", "").strip() or None,
                "date_mise_a_jour_n8n": row.get("date de mise à jour n8n", "").strip() or None,
                "etiquettes": row.get("Étiquettes", "").strip() or None,
            }
            
            # Ne pas ajouter si la ligne est vide
            if any(clean_row.values()):
                rows.append(clean_row)
    
    print(f"✅ {len(rows)} lignes trouvées")
    
    if not rows:
        print("❌ Aucune donnée à importer")
        return False
    
    # Importer par batch
    batch_size = 100
    for i in range(0, len(rows), batch_size):
        batch = rows[i:i+batch_size]
        
        url = f"{SUPABASE_URL}/rest/v1/{TABLE_NAME}"
        
        print(f"📤 Import du batch {i//batch_size + 1}... ({len(batch)} lignes)")
        
        try:
            response = requests.post(
                url,
                headers=headers,
                json=batch
            )
            
            if response.status_code in [200, 201]:
                print(f"✅ Batch {i//batch_size + 1} importé")
            else:
                print(f"⚠️ Erreur {response.status_code}: {response.text}")
                
        except Exception as e:
            print(f"❌ Erreur lors de l'import: {e}")
            return False
    
    print("\n🎉 Import terminé !")
    return True

if __name__ == "__main__":
    print("=" * 50)
    print("📊 Import CSV → Supabase")
    print("=" * 50)
    
    create_table()
    
    print("\n⚠️ Important :")
    print("1. Créez la table 'base_connaissance' dans Supabase (voir colonnes ci-dessus)")
    print("2. Assurez-vous que RLS est désactivé (ou configure pour accepter les inserts)")
    print("3. Puis réexécutez ce script")
    
    # import_csv_to_supabase()
