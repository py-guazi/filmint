// hooks/useDexie.ts
import { useEffect, useState } from 'react';
import { db } from '../lib/db';
import { Table } from 'dexie';

type QueryFunction<T = any> = (table: Table<T>) => Promise<T[]> | Promise<T>;

interface UseDexieResult<T> {
  data: T[];
  loading: boolean;
  error: Error | null;
}

export function useDexie<T = any>(
  tableName: string,
  queryFn?: QueryFunction<T>,
  deps: React.DependencyList = []
): UseDexieResult<T> {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    setLoading(true);
    
    const fetchData = async () => {
      try {
        const table = db.table<T>(tableName);
        const result = queryFn 
          ? await queryFn(table)
          : await table.toArray();
        
        // Ensure we always return an array for consistent typing
        setData(Array.isArray(result) ? result : [result]);
      } catch (err) {
        setError(err instanceof Error ? err : new Error(String(err)));
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [tableName, ...deps]); // Include tableName in dependencies

  return { data, loading, error };
}