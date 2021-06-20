<h1 align="center">
 Digital Green Certificates: Business Rules
</h1>

<p align="center">
    <a href="#about">About</a> •
    <a href="#testing--status">Testing & Status</a> •
    <a href="#licensing">Licensing</a>
</p>


## About

The [Digital COVID Certificate (DCC)](https://ec.europa.eu/info/live-work-travel-eu/coronavirus-response/safe-covid-19-vaccines-europeans/eu-digital-covid-certificate_en) allows to determine whether a person is deemed fit-for-travel into a country-of-arrival (CoA) based on their vaccination, test, and recovery status.
To make such determinations, business (or validation, or verification) rules have to be implemented in verifier apps.

This repository contains a framework to implement (sets of) rules in verifier apps (and backends) using a _rules engine_.
It [explains how to do that](./documentation/how-to.md) in a way that makes these rules interchangeable across implementors.
The advantage of this approach is that it ultimately allows citizens to check their fit-for-travel status into an intended CoA _ahead_ of travel, aganst the actual rules.
This can be achieved by adhering to a common, and testable and verifiable way of defining, and executing rules.

This work is a result of work done by the EU Taskforce Business Rules.

The (JSON Schema) technical specification for the EU DCC can be found [here](https://ec.europa.eu/health/sites/default/files/ehealth/docs/covid-certificate_json_specification_en.pdf).

Relevant documents and links can be found [here](./documentation/documents-links.md).

## jitpack (maven repo)
[![](https://jitpack.io/v/section42/dgc-business-rules.svg)](https://jitpack.io/#section42/dgc-business-rules)

- implementation 'com.github.section42:dgc-business-rules:{{release-tag}}'



## Assumptions

Various code in this repo assumes that the following two repos are cloned right next to where this repo's cloned:

* [ehn-dcc-schema](https://github.com/ehn-dcc-development/ehn-dcc-schema)
* ([dgc-testdata](https://github.com/ehn-dcc-development/dgc-testdata))


## Organisation

This repository contains the following:

* [Documentation](./documentation): currently a [How-To](./documentation/how-to.md), [design choices](./documentation/design-choices.md), and [documents/links](./documentation/documents-links.md).
* [CertLogic](./certlogic/README.md): a specification, reference implementations for various platforms, a test suite, and a validation tool.
  CertLogic is generic, and not tied to the DCC, to make it easier to understand, test, expand, etc. independently.
* [RulesRunner](./rules-runner/README.md): implementations of components for running rule(set)s against a DCC payload, for various platforms, including testing.
* [Rule sets](./rulesets): implementations of rule sets with unit tests - for now that of the EU-template, but later of possibly various member states as well.

**TODO**  The contents of the [javascript](./javascript) directory still have to be moved to their proper places, and are currently provided as-is *only*, without guarantee of them being useful.


## Testing & Status

- If you found any problems, please create an [Issue](/../../issues).
- Please make sure to review the issues to see if any other members states found issues with your provided test data.
- Current status: Work-In-Progress. 


## Licensing

Copyright (c) 2021 Ministry of Health, Science, and Sports, and all other contributors

Licensed under the **Apache License, Version 2.0** (the "License"); you may not use this file except in compliance with the License.

You may obtain a copy of the License at https://www.apache.org/licenses/LICENSE-2.0.

Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" 
BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the [LICENSE](./LICENSE) for the specific 
language governing permissions and limitations under the License.

