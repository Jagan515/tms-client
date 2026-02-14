import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()]
  // ,
  // server: {
  //   host: true,
  //   strictPort: true,
  //   allowedHosts: true
  // }
})




// ,
//   server: {
//     host: true,
//     strictPort: true,
//     allowedHosts: true
//   }