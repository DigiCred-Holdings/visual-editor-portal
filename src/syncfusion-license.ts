import { registerLicense } from '@syncfusion/ej2-base';

const licenseKey = import.meta.env.VITE_SYNCFUSION_LICENSE_KEY;

export function registerSyncfusionLicense() {
  if (licenseKey) {
    registerLicense(licenseKey);
  } else {
    console.warn('Syncfusion license key not found. Please check your .env file.');
  }
}