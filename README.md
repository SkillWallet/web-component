
# SkillWallet Web Component installation

 ##### React App

1. Install the library
 `npm i @skill-wallet/auth --save`

2. Import in the App.js/tsx
 `import '@skill-wallet/auth'`

3. Add the custom HTML tag and populate the partner-key property
###### Example


```
import './App.css';
import '@skill-wallet/auth';

function App() {
  return (
    <div>
        <sw-auth partner-key="c3842343a29eac1d33a53bt60gfs1aqcg6g5g71d"></sw-auth>
    </div>
  );
}

export default App;

```
