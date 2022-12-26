import React, { useState, createContext, useEffect, useCallback } from "react";

export const GapiClientContext = createContext();

const GapiContextProvider = ({ session, ...props }) => {

  const [GapiClient, setGapiClient] = useState(); //{ gapi });

  const initClient = useCallback(async () => {
    if (window.gapiIsInitialized) return;
   
    const auth2 = gapi.auth2.init({
        client_id: "118195005036-cn4ugtn285hkvq8iu3f6lhdlmgu4kpoa.apps.googleusercontent.com",
        scope: "https://www.googleapis.com/auth/business.manage",
        immediate: true
    });

    auth2.getAuthInstance().signIn().then(() => function(authResult){
        
        if (authResult['code']) {    
            authCode = authResult['code'];
            var e = document.createElement("pre");
            e.innerHTML = JSON.stringify(authResult, undefined, 2);
            document.body.appendChild(e);
            console.log(authCode)
        
        } else {
            // There was an error.
            console.log("GAPI BUG Failed!");
        }
    });
  }, []);


  const setupGapi = useCallback(async () => {
    const gapi = await import("gapi-script").then((pack) => pack.gapi);
    setGapiClient({ gapi });
    try {
      await gapi.load("client:auth2", initClient);
    } catch (e) {
      window.gapiIsLoading = false;
      console.log("couldnt sign in to gAPI!", e);
    }

  }, [initClient]);

  useEffect(() => {
    if (window.gapiIsInitialized || window.gapiIsLoading) return;
    window.gapiIsLoading = true;
    setupGapi();
  }, [initClient, setupGapi]);

  return (
    <GapiClientContext.Provider
      value={{
        GapiClient
      }}
    >
      {props.children}
    </GapiClientContext.Provider>
  );
};

export default GapiContextProvider;