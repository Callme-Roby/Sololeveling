import notifee, { EventType } from '@notifee/react-native';
import { registerRootComponent } from 'expo';

import App from './App';

// Requis par Notifee : gere les evenements alarme quand l'app est en
// arriere-plan / tuee. On stoppe la sonnerie en boucle si l'utilisateur
// balaie ou appuie sur une action depuis la notification plein ecran.
notifee.onBackgroundEvent(async ({ type, detail }) => {
  const id = detail.notification?.id;
  if (!id) return;
  if (type === EventType.DISMISSED || type === EventType.ACTION_PRESS) {
    await notifee.cancelNotification(id).catch(() => {});
  }
});

registerRootComponent(App);
