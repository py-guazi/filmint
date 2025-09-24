import { createConfig, http } from "wagmi"
import { filecoin, filecoinCalibration } from "wagmi/chains"
import { metaMask } from "wagmi/connectors"

export const config = createConfig({
  chains: [filecoin, filecoinCalibration],
  connectors: [metaMask()],
  transports: {
    [filecoin.id]: http("https://api.node.glif.io/rpc/v1"),
    [filecoinCalibration.id]: http("https://api.calibration.node.glif.io/rpc/v1"),
  },
})
