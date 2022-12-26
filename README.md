Simple based environment for Nextjs and Reactjs development.

## Requirements

- nodejs
- npm 12
- lib datetime ``https://codesandbox.io/s/v64l7r7mr5?file=/package.json:351-372``

## Launch the environment

**Be sure you have nothing running on port 80, and also that you are using the native version of nodejs.**

You should now be able to access the nextjs instance on `http://localhost`

## Launch environment without loosing database state

If at some point you containers stopped and you don't want to loose your database state, simply run:

```
npm install
npm run dev
```

## Login admin UI

Go to [http://localhost:3000/](http://localhost:3000/)

User Admin: admin@gmail.com
Pass: 123456789

User 1: user1@gmail.com
pass: 123456789

User 2: user2@gmail.com
pass: 123456789
