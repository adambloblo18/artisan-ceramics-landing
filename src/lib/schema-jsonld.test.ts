import { describe, test } from "node:test";
import { strict as assert } from "node:assert";
import { homepageSchema, faqSchema } from "./schema-jsonld";

const graph = homepageSchema["@graph"];

describe("homepage entity identity and relationships", () => {
  test("declares exactly one organization with the principal site's identity", () => {
    const organizations = graph.filter((node) => node["@type"] === "LocalBusiness");
    assert.equal(organizations.length, 1);
    const organization = organizations[0];
    assert.ok(organization && "foundingDate" in organization);
    assert.equal(organization["@id"], "https://www.ceramique-murale.com/#organization");
    assert.equal(organization.foundingDate, "2008");
    assert.equal(organization.telephone, "+33670025133");
    assert.equal(organization.address.streetAddress, "14 rue Ernest André");
    assert.equal(organization.address.postalCode, "78110");
  });

  test("links the founder to the same organization", () => {
    const person = graph.find((node) => node["@type"] === "Person");
    assert.ok(person && "worksFor" in person);
    assert.equal(person["@id"], "https://www.ceramique-murale.com/#laurence-brecher");
    assert.equal(person.worksFor?.["@id"], "https://www.ceramique-murale.com/#organization");
  });

  test("links the French service to its provider using stable identifiers", () => {
    const service = graph.find((node) => node["@type"] === "Service");
    assert.ok(service && "provider" in service);
    assert.equal(service["@id"], "https://credence.ceramique-murale.com/#service");
    assert.equal(service.provider?.["@id"], "https://www.ceramique-murale.com/#organization");
    assert.equal(service.areaServed, "France");
  });

  test("links the French webpage to the service and publisher", () => {
    const webpage = graph.find((node) => node["@type"] === "WebPage");
    assert.ok(webpage && "publisher" in webpage);
    assert.equal(webpage["@id"], "https://credence.ceramique-murale.com/#webpage");
    assert.equal(webpage.about?.["@id"], "https://credence.ceramique-murale.com/#service");
    assert.equal(webpage.publisher?.["@id"], "https://www.ceramique-murale.com/#organization");
    assert.equal(webpage.inLanguage, "fr-FR");
  });

  test("does not add price ranges or unverified ratings and reviews", () => {
    for (const node of graph) {
      assert.equal("priceRange" in node, false);
      assert.equal("aggregateRating" in node, false);
      assert.equal("review" in node, false);
      assert.notEqual(node["@type"], "ProfessionalService");
    }
  });

  test("retains the existing FAQ entity exactly once", () => {
    assert.deepEqual(graph.filter((node) => node["@type"] === "FAQPage"), [faqSchema]);
  });
});