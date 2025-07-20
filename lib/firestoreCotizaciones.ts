import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from './firebase';

type Cotizacion = {
  precio: string;
  fecha: string;
};

export async function guardarCotizacion(moneda: 'dolar' | 'real', precio: string): Promise<boolean> {
  try {
    const ahora = new Date();
    const fecha = ahora.toLocaleString('es-AR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

    const ref = doc(db, 'cotizaciones', moneda);
    await setDoc(ref, { precio, fecha });

    return true;
  } catch (error) {
    console.error('Error guardando cotización:', error);
    return false;
  }
}

export async function obtenerUltimasCotizaciones(): Promise<{
  dolar: Cotizacion | null;
  real: Cotizacion | null;
}> {
  try {
    const dolarSnap = await getDoc(doc(db, 'cotizaciones', 'dolar'));
    const realSnap = await getDoc(doc(db, 'cotizaciones', 'real'));

    return {
      dolar: dolarSnap.exists() ? (dolarSnap.data() as Cotizacion) : null,
      real: realSnap.exists() ? (realSnap.data() as Cotizacion) : null,
    };
  } catch (error) {
    console.error('Error obteniendo cotizaciones:', error);
    return { dolar: null, real: null };
  }
}
