const mockStudies: {
  name: string
  results: (number | undefined)[]
  subRows: {
    name: string
    results: (number | undefined)[]
  }[]
}[] = [
  {
    name: "PAIRED_BOYDEN",
    results: [
      undefined,
      0.53,
      0.58,
      0.34,
      0.65,
      0.32,
      0.53,
      0.64,
      0.33,
      undefined
    ],
    subRows: [
      {
        name: "paired_boyden32c",
        results: [
          undefined,
          0.53,
          0.58,
          0.34,
          0.65,
          0.32,
          0.53,
          0.64,
          0.33,
          undefined
        ]
      }
    ]
  },
  {
    name: "PAIRED_CRCNS_HC1",
    results: [
      undefined,
      0.75,
      0.64,
      0.5,
      0.75,
      0.67,
      0.76,
      0.78,
      0.73,
      undefined
    ],
    subRows: [
      {
        name: "paired_crcns",
        results: [
          undefined,
          0.75,
          0.64,
          0.5,
          0.75,
          0.67,
          0.76,
          0.78,
          0.73,
          undefined
        ]
      }
    ]
  },
  {
    name: "SYNTH_BIONET",
    results: [
      undefined,
      0.86,
      0.74,
      0.81,
      0.77,
      undefined,
      0.73,
      0.68,
      0.54,
      undefined
    ],
    subRows: [
      {
        name: "synth_bionet_static",
        results: [
          undefined,
          0.87,
          0.85,
          0.83,
          0.8,
          undefined,
          0.77,
          0.75,
          0.58,
          undefined
        ]
      },
      {
        name: "synth_bionet_drift",
        results: [
          undefined,
          0.86,
          0.68,
          0.79,
          0.79,
          undefined,
          0.71,
          0.65,
          0.52,
          undefined
        ]
      },
      {
        name: "synth_bionet_shuffle",
        results: [
          undefined,
          0.84,
          0.69,
          0.8,
          0.72,
          undefined,
          0.72,
          0.6,
          0.52,
          undefined
        ]
      }
    ]
  },
  {
    name: "SYNTH_MEAREC_NEURONEXUS",
    results: [
      undefined,
      0.94,
      undefined,
      0.91,
      0.97,
      0.88,
      0.92,
      0.99,
      0.98,
      undefined
    ],
    subRows: [
      {
        name: "synth_mearec_neuronexus_noise10_K10_C32",
        results: [
          undefined,
          0.96,
          undefined,
          0.97,
          0.99,
          0.85,
          0.92,
          0.99,
          0.97,
          undefined
        ]
      },
      {
        name: "synth_mearec_neuronexus_noise10_K20_C32",
        results: [
          undefined,
          0.93,
          undefined,
          0.86,
          1,
          0.88,
          0.92,
          1,
          0.99,
          undefined
        ]
      },
      {
        name: "synth_bionet_shuffle",
        results: [
          undefined,
          0.84,
          0.69,
          0.8,
          0.72,
          undefined,
          0.72,
          0.6,
          0.52,
          undefined
        ]
      }
    ]
  }
]

export default mockStudies
