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

# Web Component Developer notes

When a user successfully logs in their SkillWallet information is stored in the 'Session Storage' with the Key 'skillWallet'.

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

##### Angular

1. Install the library  
   `npm i @skill-wallet/auth --save`

2. Import the initialization function in the app.component.ts  
   `import { InitSwAuth } from '@skill-wallet/auth';`

3. Call the InitSwAuth function inside ngOnInit
   `ngOnInit(): void { InitSwAuth(); }`

4. Add the CUSTOM_ELEMENTS_SCHEMA in your app.module.ts
   `import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';`

5. Add the custom HTML tag and populate the partner-key property

###### Example

app.component.ts:

```
import { Component, OnInit } from '@angular/core';
import { InitSwAuth } from '@skill-wallet/auth';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  ngOnInit(): void {
    InitSwAuth();
  }
  title = 'ngular-app';
}
```

app.module.ts:

```
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';

@NgModule({
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  declarations: [AppComponent],
  imports: [BrowserModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}

```

app.component.ts:

```
...
  <sw-auth
  partner-key="your partner key here"></sw-auth>
...
```

##### Vue

1. Install the library  
   `npm i @skill-wallet/auth --save`

2. Import the initialization function in the App.vue  
   `import { InitSwAuth } from '@skill-wallet/auth';`

3. Call the InitSwAuth function at the start of your project  
   `InitSwAuth();`

4. Add the custom HTML tag and populate the partner-key property

###### Example

App.vue:

```
<script setup>
import HelloWorld from "./components/HelloWorld.vue";
import TheWelcome from "./components/TheWelcome.vue";
import { InitSwAuth } from "@skill-wallet/auth";
InitSwAuth();
</script>

<template>
  <header>
    <img
      alt="Vue logo"
      class="logo"
      src="./assets/logo.svg"
      width="125"
      height="125"
    />

    <div class="wrapper">
      <sw-auth
        partner-key="0904d77ea971c3aff9e1d46410ab1600d8537641"
        use-dev="true"
        id="root"
        use-button-options="true"
      ></sw-auth>
      <HelloWorld msg="You did it!" />
    </div>
  </header>

  <main>
    <TheWelcome />
  </main>
</template>

<style>
@import "./assets/base.css";

#app {
  max-width: 1280px;
  margin: 0 auto;
  padding: 2rem;

  font-weight: normal;
}

header {
  line-height: 1.5;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

a,
.green {
  text-decoration: none;
  color: hsla(160, 100%, 37%, 1);
  transition: 0.4s;
}

@media (hover: hover) {
  a:hover {
    background-color: hsla(160, 100%, 37%, 0.2);
  }
}

@media (min-width: 1024px) {
  body {
    display: flex;
    place-items: center;
  }

  #app {
    display: grid;
    grid-template-columns: 1fr 1fr;
    padding: 0 2rem;
  }

  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }

  .logo {
    margin: 0 2rem 0 0;
  }
}
</style>

```

# Web Component Custom HTML element attributes:

1. partner-key  
   `The key you are given after signing a Partner's Agreement`

2. use-dev
   `Set to 'true' to use the 'Mumbai' TestNet`

3. use-button-options
   `If set to 'true' a dropdown will pop up when hovering over the Button. Currently the only option is 'Logout'.`
