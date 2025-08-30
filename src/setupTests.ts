import "@testing-library/jest-dom"

global.TextEncoder = require("util").TextEncoder
global.TextDecoder = require("util").TextDecoder

const localStorageMock = {
   getItem: () => null,
   setItem: () => { },
   removeItem: () => { },
   clear: () => { },
   length: 0,
   key: () => null,
}
Object.defineProperty(window, "localStorage", {
   value: localStorageMock,
})

Object.defineProperty(window, "matchMedia", {
   writable: true,
   value: () => ({
      matches: false,
      media: "",
      onchange: null,
      addListener: () => { },
      removeListener: () => { },
      addEventListener: () => { },
      removeEventListener: () => { },
      dispatchEvent: () => { },
   }),
})
