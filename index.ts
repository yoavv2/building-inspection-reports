import { registerRootComponent } from 'expo';

import App from './App';
import { setupRTL } from './src/lib/rtl';

setupRTL();

registerRootComponent(App);
