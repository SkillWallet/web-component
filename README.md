# SkillWallet Web Component installation

##### React App

1. Install the library
   `npm i @skill-wallet/auth --save`

2. Import the initialization function in the App.js/tsx (or index.js/tsx)
   `import { InitSwAuth } from '@skill-wallet/auth';`

3. Call the InitSwAuth function at the start of your project
   `InitSwAuth();`

4. Add the custom HTML tag and populate the partner-key property

###### Example

```
import './App.css';
import { InitSwAuth } from '@skill-wallet/auth;

function App() {
  return (
    <div>
        <sw-auth partner-key="c3842343a29eac1d33a53bt60gfs1aqcg6g5g71d"></sw-auth>
    </div>
  );
}

InitSwAuth();
export default App;
```
