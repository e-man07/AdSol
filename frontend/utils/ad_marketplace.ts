/**
 * Program IDL in camelCase format in order to be used in JS/TS.
 *
 * Note that this is only a type helper and is not the actual IDL. The original
 * IDL can be found at `target/idl/ad_marketplace.json`.
 */
export type AdMarketplace = {
  "address": "5JFj9EFPa45pycaUmR8GwdzNXjZqZQ5ZQ3n6ndhQPYse",
  "metadata": {
    "name": "adMarketplace",
    "version": "0.1.0",
    "spec": "0.1.0",
    "description": "Created with Anchor"
  },
  "instructions": [
    {
      "name": "buyFixedPrice",
      "discriminator": [
        75,
        238,
        55,
        242,
        206,
        229,
        105,
        255
      ],
      "accounts": [
        {
          "name": "adSlot",
          "writable": true
        },
        {
          "name": "buyer",
          "writable": true,
          "signer": true
        }
      ],
      "args": []
    },
    {
      "name": "closeAuction",
      "discriminator": [
        225,
        129,
        91,
        48,
        215,
        73,
        203,
        172
      ],
      "accounts": [
        {
          "name": "adSlot",
          "writable": true
        },
        {
          "name": "owner",
          "writable": true,
          "signer": true
        }
      ],
      "args": []
    },
    {
      "name": "createAd",
      "discriminator": [
        103,
        133,
        51,
        53,
        3,
        145,
        44,
        142
      ],
      "accounts": [
        {
          "name": "ad",
          "writable": true,
          "signer": true
        },
        {
          "name": "owner",
          "writable": true,
          "signer": true
        },
        {
          "name": "slot"
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "adId",
          "type": "string"
        },
        {
          "name": "mediaCid",
          "type": "string"
        }
      ]
    },
    {
      "name": "createAdSlot",
      "discriminator": [
        84,
        96,
        90,
        104,
        188,
        66,
        237,
        230
      ],
      "accounts": [
        {
          "name": "adSlot",
          "writable": true,
          "signer": true
        },
        {
          "name": "owner",
          "writable": true,
          "signer": true
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
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
          "name": "category",
          "type": "string"
        },
        {
          "name": "audienceSize",
          "type": "u64"
        }
      ]
    },
    {
      "name": "deactivateSlot",
      "discriminator": [
        134,
        227,
        70,
        134,
        219,
        185,
        7,
        225
      ],
      "accounts": [
        {
          "name": "adSlot",
          "writable": true
        },
        {
          "name": "owner",
          "writable": true,
          "signer": true
        }
      ],
      "args": []
    },
    {
      "name": "incrementView",
      "discriminator": [
        40,
        245,
        156,
        180,
        36,
        179,
        163,
        229
      ],
      "accounts": [
        {
          "name": "adSlot",
          "writable": true
        }
      ],
      "args": []
    },
    {
      "name": "placeBid",
      "discriminator": [
        238,
        77,
        148,
        91,
        200,
        151,
        92,
        146
      ],
      "accounts": [
        {
          "name": "adSlot",
          "writable": true
        },
        {
          "name": "bidder",
          "writable": true,
          "signer": true
        }
      ],
      "args": [
        {
          "name": "bidAmount",
          "type": "u64"
        }
      ]
    }
  ],
  "accounts": [
    {
      "name": "ad",
      "discriminator": [
        81,
        91,
        73,
        106,
        215,
        137,
        214,
        47
      ]
    },
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
    }
  ],
  "events": [
    {
      "name": "adCreated",
      "discriminator": [
        248,
        243,
        176,
        143,
        45,
        118,
        189,
        216
      ]
    },
    {
      "name": "auctionClosed",
      "discriminator": [
        104,
        72,
        168,
        177,
        241,
        79,
        231,
        167
      ]
    },
    {
      "name": "bidPlaced",
      "discriminator": [
        135,
        53,
        176,
        83,
        193,
        69,
        108,
        61
      ]
    },
    {
      "name": "slotCreated",
      "discriminator": [
        197,
        65,
        108,
        214,
        61,
        146,
        184,
        122
      ]
    },
    {
      "name": "slotPurchased",
      "discriminator": [
        45,
        233,
        55,
        78,
        82,
        206,
        170,
        85
      ]
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "invalidPurchaseType",
      "msg": "Invalid purchase type"
    },
    {
      "code": 6001,
      "name": "slotNotActive",
      "msg": "Ad slot not active"
    },
    {
      "code": 6002,
      "name": "bidTooLow",
      "msg": "Bid too low"
    },
    {
      "code": 6003,
      "name": "auctionEnded",
      "msg": "Auction has ended"
    },
    {
      "code": 6004,
      "name": "auctionNotEnded",
      "msg": "Auction has not ended"
    },
    {
      "code": 6005,
      "name": "unauthorized",
      "msg": "Unauthorized action"
    }
  ],
  "types": [
    {
      "name": "ad",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "owner",
            "type": "pubkey"
          },
          {
            "name": "adId",
            "type": "string"
          },
          {
            "name": "mediaCid",
            "type": "string"
          },
          {
            "name": "slotKey",
            "type": "pubkey"
          }
        ]
      }
    },
    {
      "name": "adCreated",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "adId",
            "type": "string"
          },
          {
            "name": "owner",
            "type": "pubkey"
          }
        ]
      }
    },
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
      "name": "auctionClosed",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "slotId",
            "type": "string"
          },
          {
            "name": "winner",
            "type": "pubkey"
          }
        ]
      }
    },
    {
      "name": "bidPlaced",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "slotId",
            "type": "string"
          },
          {
            "name": "bidder",
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
      "name": "slotCreated",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "slotId",
            "type": "string"
          },
          {
            "name": "owner",
            "type": "pubkey"
          }
        ]
      }
    },
    {
      "name": "slotPurchased",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "slotId",
            "type": "string"
          },
          {
            "name": "buyer",
            "type": "pubkey"
          }
        ]
      }
    }
  ]
};
