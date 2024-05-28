"use client";

import {useEffect} from "react";

export default function ClientRedirect({uri}: {uri: string}) {
  useEffect(() => {
    fetch('/auth/exchange/finish', {
      method: 'POST'
    }).then(() => {
      location.href = uri;
    })
  }, [uri]);
  return <>
    Loading...
  </>
}
