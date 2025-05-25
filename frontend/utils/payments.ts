/**
 * Program IDL in camelCase format in order to be used in JS/TS.
 *
 * Note that this is only a type helper and is not the actual IDL. The original
 * IDL can be found at `target/idl/payments.json`.
 */
export type Payments = {
  "address": "5D3Ngbtgv2W3hyU7hCdXcx1XUZuFUyH1ufLstw1V7eN6",
  "metadata": {
    "name": "payments",
    "version": "0.1.0",
    "spec": "0.1.0",
    "description": "Created with Anchor"
  },
  "instructions": [
    {
      "name": "escrowPayment",
      "discriminator": [
        139,
        86,
        100,
        49,
        169,
        160,
        160,
        12
      ],
      "accounts": [
        {
          "name": "escrow",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  101,
                  115,
                  99,
                  114,
                  111,
                  119
                ]
              },
              {
                "kind": "account",
                "path": "advertiser"
              },
              {
                "kind": "account",
                "path": "adSlot"
              }
            ]
          }
        },
        {
          "name": "advertiser",
          "writable": true,
          "signer": true
        },
        {
          "name": "adSlot"
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "amount",
          "type": "u64"
        }
      ]
    },
    {
      "name": "refundEscrow",
      "discriminator": [
        107,
        186,
        89,
        99,
        26,
        194,
        23,
        204
      ],
      "accounts": [
        {
          "name": "escrow",
          "writable": true
        },
        {
          "name": "advertiser",
          "writable": true,
          "relations": [
            "escrow"
          ]
        },
        {
          "name": "adSlot"
        },
        {
          "name": "authority",
          "signer": true
        }
      ],
      "args": []
    },
    {
      "name": "releaseEscrow",
      "discriminator": [
        146,
        253,
        129,
        233,
        20,
        145,
        181,
        206
      ],
      "accounts": [
        {
          "name": "escrow",
          "writable": true
        },
        {
          "name": "publisher",
          "writable": true,
          "relations": [
            "escrow"
          ]
        },
        {
          "name": "adSlot"
        },
        {
          "name": "authority",
          "signer": true
        }
      ],
      "args": []
    }
  ],
  "accounts": [
    {
      "name": "adSlot",
      "discriminator": [
        144,
        74,
        20,
        57,
        15,
        178,
        12,
        70
      ]
    },
    {
      "name": "escrow",
      "discriminator": [
        31,
        213,
        123,
        187,
        186,
        22,
        218,
        155
      ]
    }
  ],
  "events": [
    {
      "name": "escrowCreated",
      "discriminator": [
        70,
        127,
        105,
        102,
        92,
        97,
        7,
        173
      ]
    },
    {
      "name": "escrowRefunded",
      "discriminator": [
        132,
        209,
        49,
        109,
        135,
        138,
        28,
        81
      ]
    },
    {
      "name": "escrowReleased",
      "discriminator": [
        131,
        7,
        138,
        104,
        166,
        190,
        113,
        112
      ]
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "invalidEscrow",
      "msg": "Invalid escrow state"
    },
    {
      "code": 6001,
      "name": "slotActive",
      "msg": "Ad slot still active"
    },
    {
      "code": 6002,
      "name": "invalidAmount",
      "msg": "Invalid amount"
    },
    {
      "code": 6003,
      "name": "escrowAlreadyReleased",
      "msg": "Escrow already released"
    },
    {
      "code": 6004,
      "name": "insufficientFunds",
      "msg": "Insufficient funds in escrow"
    },
    {
      "code": 6005,
      "name": "unauthorized",
      "msg": "Unauthorized action"
    }
  ],
  "types": [
    {
      "name": "adSlot",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "owner",
            "type": "pubkey"
          },
          {
            "name": "slotId",
            "type": "string"
          },
          {
            "name": "price",
            "type": "u64"
          },
          {
            "name": "duration",
            "type": "u64"
          },
          {
            "name": "isAuction",
            "type": "bool"
          },
          {
            "name": "auctionEnd",
            "type": "i64"
          },
          {
            "name": "highestBid",
            "type": "u64"
          },
          {
            "name": "highestBidder",
            "type": "pubkey"
          },
          {
            "name": "isActive",
            "type": "bool"
          },
          {
            "name": "viewCount",
            "type": "u64"
          },
          {
            "name": "category",
            "type": "string"
          },
          {
            "name": "audienceSize",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "escrow",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "amount",
            "type": "u64"
          },
          {
            "name": "advertiser",
            "type": "pubkey"
          },
          {
            "name": "publisher",
            "type": "pubkey"
          },
          {
            "name": "isReleased",
            "type": "bool"
          }
        ]
      }
    },
    {
      "name": "escrowCreated",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "escrowKey",
            "type": "pubkey"
          },
          {
            "name": "advertiser",
            "type": "pubkey"
          },
          {
            "name": "publisher",
            "type": "pubkey"
          },
          {
            "name": "amount",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "escrowRefunded",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "escrowKey",
            "type": "pubkey"
          },
          {
            "name": "advertiser",
            "type": "pubkey"
          },
          {
            "name": "amount",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "escrowReleased",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "escrowKey",
            "type": "pubkey"
          },
          {
            "name": "publisher",
            "type": "pubkey"
          },
          {
            "name": "amount",
            "type": "u64"
          }
        ]
      }
    }
  ]
};