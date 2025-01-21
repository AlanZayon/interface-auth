// src/hooks/useQueryParams.js
import { useEffect, useState } from "react";

export function useQueryParams() {
  const [queryParams, setQueryParams] = useState({ name: "", email: "" });

  useEffect(() => {
    const getParameterByName = (name) => {
      const url = window.location.href;
      name = name.replace(/[[\]]/g, "\\$&");
      const regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)");
      const results = regex.exec(url);
      if (!results) return null;
      if (!results[2]) return "";
      return decodeURIComponent(results[2].replace(/\+/g, " "));
    };

    const name = getParameterByName("name");
    const email = getParameterByName("email");

    setQueryParams({ name: name || "", email: email || "" });
  }, []);

  return queryParams;
}
