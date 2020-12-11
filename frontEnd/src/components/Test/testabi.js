const abi = [
  {
    inputs: [
      {
        internalType: "contract FakeLink",
        name: "_FL",
        type: "address",
      },
      {
        internalType: "contract FakeAugur",
        name: "_FA",
        type: "address",
      },
      {
        internalType: "contract FakeBAT",
        name: "_FB",
        type: "address",
      },
      {
        internalType: "contract FakewBTC",
        name: "_FWB",
        type: "address",
      },
      {
        internalType: "contract FakewETH",
        name: "_FWE",
        type: "address",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    name: "dontDoIT",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
    constant: true,
  },
  {
    inputs: [],
    name: "fakeAugur",
    outputs: [
      {
        internalType: "contract FakeAugur",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
    constant: true,
  },
  {
    inputs: [],
    name: "fakeBAT",
    outputs: [
      {
        internalType: "contract FakeBAT",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
    constant: true,
  },
  {
    inputs: [],
    name: "fakeLINK",
    outputs: [
      {
        internalType: "contract FakeLink",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
    constant: true,
  },
  {
    inputs: [],
    name: "fakewBTC",
    outputs: [
      {
        internalType: "contract FakewBTC",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
    constant: true,
  },
  {
    inputs: [],
    name: "fakewETH",
    outputs: [
      {
        internalType: "contract FakewETH",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
    constant: true,
  },
  {
    inputs: [],
    name: "gimme",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];
module.exports = abi;
