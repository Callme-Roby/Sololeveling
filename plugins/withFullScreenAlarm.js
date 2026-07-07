const { withAndroidManifest, AndroidConfig } = require('@expo/config-plugins');

/**
 * Config plugin : rend possible une vraie alarme plein ecran Android.
 * - Ajoute les permissions AlarmManager / full-screen intent / boot.
 * - Marque la MainActivity comme affichable au-dessus de l'ecran
 *   verrouille et capable d'allumer l'ecran, pour que la sonnerie
 *   apparaisse comme un reveil meme telephone verrouille.
 */
const ALARM_PERMISSIONS = [
  'android.permission.USE_FULL_SCREEN_INTENT',
  'android.permission.SCHEDULE_EXACT_ALARM',
  'android.permission.USE_EXACT_ALARM',
  'android.permission.WAKE_LOCK',
  'android.permission.VIBRATE',
  'android.permission.RECEIVE_BOOT_COMPLETED',
  'android.permission.POST_NOTIFICATIONS',
  'android.permission.DISABLE_KEYGUARD',
];

const withFullScreenAlarm = (config) =>
  withAndroidManifest(config, (cfg) => {
    const manifest = cfg.modResults.manifest;

    manifest['uses-permission'] = manifest['uses-permission'] || [];
    const present = new Set(
      manifest['uses-permission'].map((p) => p.$ && p.$['android:name']),
    );
    for (const name of ALARM_PERMISSIONS) {
      if (!present.has(name)) {
        manifest['uses-permission'].push({ $: { 'android:name': name } });
      }
    }

    const application = AndroidConfig.Manifest.getMainApplicationOrThrow(
      cfg.modResults,
    );
    const mainActivity = (application.activity || []).find(
      (a) => a.$ && a.$['android:name'] === '.MainActivity',
    );
    if (mainActivity) {
      mainActivity.$['android:showWhenLocked'] = 'true';
      mainActivity.$['android:turnScreenOn'] = 'true';
    }

    return cfg;
  });

module.exports = withFullScreenAlarm;
