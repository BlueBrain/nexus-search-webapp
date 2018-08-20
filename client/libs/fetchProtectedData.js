function readBlobAsync(blob) {
  return new Promise((resolve, reject) => {
    let reader = new FileReader();
    reader.onload = function() {
      resolve(this.result);
    };
    reader.onerror = function(error) {
      reject(error);
    };
    reader.readAsDataURL(blob);
  });
}

function readArrayBufferAsync(blob) {
  return new Promise((resolve, reject) => {
    let reader = new FileReader();
    reader.onloadend = function() {
      resolve(this.result);
    };
    reader.onerror = function(error) {
      reject(error);
    };
    reader.readAsArrayBuffer(blob);
  });
}

async function base64Resolver(response) {
  let blob = await response.blob();
  return await readBlobAsync(blob);
}

async function arrayBufferResolver(response) {
  let blob = await response.blob();
  return await readArrayBufferAsync(blob);
}

async function plainTextResolver(response) {
  return await response.text();
}

function fetchPrivateDataFactory(resolver) {
  return async function(url, token) {
    let response;
    try {
      let headers = new Headers({ Authorization: `Bearer ${token}` });
      let request = new Request(url);
      let options = {
        method: "GET",
        headers: headers,
        mode: "cors",
        cache: "default"
      };
      response = await fetch(request, options);
      return await resolver(response);
    } catch (error) {
      console.error(error);
      return null;
    }
  };
}

export default {
  asBase64: fetchPrivateDataFactory(base64Resolver),
  asPlainText: fetchPrivateDataFactory(plainTextResolver),
  asArrayBuffer: fetchPrivateDataFactory(arrayBufferResolver)
};
