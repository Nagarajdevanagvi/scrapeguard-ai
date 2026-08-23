# Observed collector failure

**Collector:** `c_mt5gcvr895y7zea7e`  
**Target:** `https://cutshort.io/jobs`  
**Observed on:** 2026-08-23

The completed run returned `source_url`, `product_page_url`, and an empty
`skills` array, but omitted the required data-contract fields `title`,
`company`, and `location`. ScrapeGuard therefore classifies the run as a
critical schema-completeness incident rather than a successful collection.

## Required repair

Preserve the collector ID and return one record per public job with the
following exact fields:

`title`, `company`, `location`, `description`, `skills`, `salary`,
`employment_type`, `source_url`.

This artifact deliberately captures only three representative records supplied
from the completed run; it is not presented as a complete dataset.
