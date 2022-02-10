# SkillWallet - Intro
SkillWallet is a new standard for Self-sovereign Identities that **do not depend from the provider**.  
They are _universal_, _individual_ NFT IDs.  
A SkillWallet _cannot be bought_ - it can only be acquired by joining a decentralized, permissionless Community that lives on the Blockchain.  
Each SkillWallet is unique, and based on someone's Skills - rather than exploiting their personal data.  
  
Also, it's **non-transferable**, so _everyone's experience and skills are truly theirs_ - and keeps track of each contribution they make in the communities they're part of, rewarding them for their participation.  
  
This makes SkillWallet **the first Identity you can truly own**.

Join a Community, claim your SkillWallet - and _become a citizen of the Metaverse_.

# Web Component - what it does
This Web Component is SkillWallet's decentralized, **role-based** authentication system.  
It lets your users create an account, or login to your platform, in a fully decentralized way, while giving them a familiar (web2-like) experience.  
Each user will add their nickname and avatar, and pick a Role in your Community - after doing that, they will join your community, and claim their universal ID.  

# Pre-requisite: obtain your Partner's Key

This Web Component is cross-platform, and can be integrated on any Web framework.  
In order to use it, though, you **will need to have a Partner's Key** - you can get deploy your role-based community on the Blockchain, and receive your Partner's Key directly on our [Partners Dapp](https://partners.skillwallet.id).

# Web Component installation

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
