#!/bin/bash

MAX_RETRIES=30
RETRY_INTERVAL=5
COUNTER=0

echo "Attente que PostgreSQL soit prêt..."
until pg_isready -h db -U $POSTGRES_USER -d $POSTGRES_DB -t 60; do
  if [ $COUNTER -eq $MAX_RETRIES ]; then
    echo "La table 'users' n'est pas prête. Arrêt du script."
    exit 1
  fi
  echo "Attente de la création des tables..."
  COUNTER=$((COUNTER+1))
  sleep $RETRY_INTERVAL
done

echo "Les tables sont prêtes. Insertion des données..."
psql -h db -U POSTGRES_USER -d POSTGRES_DB -f /docker-entrypoint-initdb.d/insertdata.sql
