import {
  MicroOrchestrator,
  i18nextBaseModule,
} from '@uprtcl/micro-orchestrator';
import { ApolloClientModule } from '@uprtcl/graphql';
import {
  HolochainConnection,
  HolochainConnectionModule,
} from '@uprtcl/holochain-provider';
import { MutualCreditModule } from 'holochain-mutual-credit';
import { SocialTriangulationModule } from 'holochain-social-triangulation';
import { ProfilesModule } from 'holochain-profiles';

import { CMApp } from './elements/hccm-app';
import { CMLogin } from './elements/hccm-login';
import { CMHome } from './elements/hccm-home';
import { CMBalance } from './elements/hccm-balance';
import { getAllowedCreditors } from './get-allowed-creditors';
import { CMOffers } from './elements/hccm-offers';
import { CMDisallowed } from './elements/hccm-disallowed';

(async function () {
  const connection = new HolochainConnection({
    host: process.env.WS_INTERFACE,
    devEnv: {
      templateDnasPaths: {
        QmXAfJ2kWkP191V3CRmonKpJRpqHvUVGa7CbL4F8jiojTy:
          '../../dnas/community-currency/dist/community-currency.dna.json',
      },
    },
  });

  const orchestrator = new MicroOrchestrator();

  await orchestrator.loadModules([
    new HolochainConnectionModule(connection),
    new i18nextBaseModule(),
    new ApolloClientModule(),
    new SocialTriangulationModule(
      {
        instance: 'mutual-credit-instance',
        dnaId: 'mutual-credit-dna',
        properties: {
          initial_members: [
            'HcSCipJrCpZzn5ga45eP9K3qhxHJiabtszGX6nsOkfkdtgeaVc7ydBeIXagn7pr',
            'HcSCjvyaY5Mkzazdcx655IY6X54uMmVRsfK8x4mms8FT8n7gsEGqzpf3I4xc6ci',
            'HcSCI4JD7ZU43yYaotU95gXInhpjysgpmZfcqyxk3prqmsexaICAZofer3gmumr',
            'HcScI7RDXHw38Seyv4suZM77Whrtdex7vn4E4hFOSz53M63tM5Nc9Qf3mxFnvea',
            'HcSciQj88o3pR9xxjxwNeSbq8S6Iff8ed7aW7NTim5y9fcrv7pQIi9EHMxmurzi',
            'HcSCjB8984OI3EI4AoEdNskSbr59qr6n83hI6Gk6CCFntdt7h8tfmS3ozphwj4z',
          ],
          necessary_vouches: 2,
        },
        templateDnaAddress: 'QmXAfJ2kWkP191V3CRmonKpJRpqHvUVGa7CbL4F8jiojTy',
      },
      'lobby-instance',
      'remote-bridge'
    ),
    new MutualCreditModule(
      'mutual-credit-instance',
      getAllowedCreditors as any
    ),
    new ProfilesModule('lobby-instance'),
  ]);

  customElements.define('hccm-app', CMApp);
  customElements.define('hccm-login', CMLogin);
  customElements.define('hccm-home', CMHome);
  customElements.define('hccm-balance', CMBalance);
  customElements.define('hccm-offers', CMOffers);
  customElements.define('hccm-disallowed', CMDisallowed);
})();
