import getConfig from "./config";
import getResources from "./getResources";
import write from "./write";
import to from "./to";
import pushToElastic from "./pushToElastic";
import waitForEach from "./waitForEach";
import processDoc from "./processDoc";
import fetchResourceById from "./fetchResourceById";

const [, , stage] = process.argv;
console.log(process.argv);
const config = getConfig(stage);

const {
  TOKEN: token,
  BASE: base,
  ORG: org,
  DOMAIN: domain,
  CONTEXT: context,
  SCHEMA: schema,
  VER: ver
} = config;

void (async function main() {
  try {
    let [error, docs] = await to(
      waitForEach(
        getResources({
          token,
          base,
          org,
          domain,
          context,
          schema,
          ver
        }),
        [
          processDoc,
          async doc => {
            return await fetchResourceById(doc, "subject", "wasDerivedFrom", token)
          },
          async doc => {
            console.log(doc);
            return doc;
          }
        ]
      )
    );
    if (!docs) {
      console.log(error, docs);
      throw new Error(
        "no docs found for some reason, maybe there was an auth error, check your token"
      );
    }
    write("Cells", docs);
    // write("ExamplePleaseThanks", docs[]);
    // let result
    // [error, result] = await pushToElastic(docs["Cell"]);
    // if (result.errors) {
    //   result.items.forEach(item => {
    //     console.log(JSON.stringify(item.index, null, 2))
    //   })
    // } else {
    //   console.log("finished!");
    // }
    if (error) {
      throw error;
    }
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
})();
