import mappingToAggs from "./mappings-to-aggs";

describe("mappingToAggs()", () => {
  it("makes a properly formed agg object", () => {
    const input = {
      sex: {
        type: "nested",
        properties: {
          "@id": {
            type: "text",
            fields: {
              raw: {
                type: "keyword"
              }
            }
          },
          label: {
            type: "text",
            fields: {
              raw: {
                type: "keyword"
              }
            }
          }
        }
      }
    };
    expect(mappingToAggs(input)).toMatchSnapshot();
  });

  it("makes a properly formed agg object with multiple inputs", () => {
    const input = {
      sex: {
        type: "nested",
        properties: {
          "@id": {
            type: "text",
            fields: {
              raw: {
                type: "keyword"
              }
            }
          },
          label: {
            type: "text",
            fields: {
              raw: {
                type: "keyword"
              }
            }
          }
        }
      },
      species: {
        type: "nested",
        properties: {
          "@id": {
            type: "text",
            fields: {
              raw: {
                type: "keyword"
              }
            }
          },
          label: {
            type: "text",
            fields: {
              raw: {
                type: "keyword"
              }
            }
          }
        }
      }
    };
    expect(mappingToAggs(input)).toMatchSnapshot();
  });

  it("can transform even nested property types", () => {
    const input = {
      brainLocation: {
        type: "nested",
        properties: {
          brainRegion: {
            type: "nested",
            properties: {
              "@id": {
                type: "text",
                fields: {
                  raw: {
                    type: "keyword"
                  }
                }
              },
              label: {
                type: "text",
                fields: {
                  raw: {
                    type: "keyword"
                  }
                }
              }
            }
          }
        }
      }
    };
    expect(mappingToAggs(input)).toMatchSnapshot();
  });

  it("can handle distribution, which is a hardcoded special case", () => {
    const input = {
      distribution: {
        type: "nested",
        properties: {
          "@context": {
            type: "text",
            fields: {
              keyword: {
                type: "keyword",
                ignore_above: 256
              }
            }
          },
          contentSize: {
            properties: {
              unit: {
                type: "text",
                fields: {
                  keyword: {
                    type: "keyword",
                    ignore_above: 256
                  }
                }
              },
              unitCode: {
                type: "text",
                fields: {
                  keyword: {
                    type: "keyword",
                    ignore_above: 256
                  }
                }
              },
              value: {
                type: "long"
              }
            }
          },
          digest: {
            properties: {
              alg: {
                type: "text",
                fields: {
                  keyword: {
                    type: "keyword",
                    ignore_above: 256
                  }
                }
              },
              algorithm: {
                type: "text",
                fields: {
                  keyword: {
                    type: "keyword",
                    ignore_above: 256
                  }
                }
              },
              value: {
                type: "text",
                fields: {
                  keyword: {
                    type: "keyword",
                    ignore_above: 256
                  }
                }
              }
            }
          },
          downloadURL: {
            type: "text"
          },
          mediaType: {
            type: "text",
            fields: {
              raw: {
                type: "keyword"
              }
            }
          },
          originalFileName: {
            type: "text"
          }
        }
      }
    };

    expect(mappingToAggs(input)).toMatchSnapshot();
  });
});
