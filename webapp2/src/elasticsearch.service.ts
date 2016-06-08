import {Injectable} from "@angular/core";
import {Http} from "@angular/http";

import moment = require("moment");

@Injectable()
export class ElasticSearchService {

    private url:string = window.location.pathname + "elasticsearch";
    private index:string = "logstash-*";

    constructor(private http:Http) {
    }

    search(query:any) {
        return this.http.post(`${this.url}/${this.index}/_search`, JSON.stringify(query))
            .map(response => {
                return response.json();
            })
            .toPromise();
    }

    getAlerts() {
        let query = {
            query: {
                filtered: {
                    filter: {
                        and: [
                            {exists: {field: "event_type"}},
                            {term: {event_type: "alert"}},
                            {not: {term: {tags: "archived"}}},
                            {range: {timestamp: {gte: "now-1d"}}}
                        ]
                    }
                }
            },
            size: 0,
            sort: [
                {"@timestamp": {order: "desc"}}
            ],
            aggs: {
                signatures: {
                    terms: {
                        field: "alert.signature.raw",
                        size: 0
                    },
                    aggs: {
                        sources: {
                            terms: {
                                field: "src_ip.raw",
                                size: 0
                            },
                            aggs: {
                                destinations: {
                                    terms: {
                                        field: "dest_ip.raw",
                                        size: 0
                                    },
                                    aggs: {
                                        newest: {
                                            top_hits: {
                                                sort: [{"@timestamp": {order: "desc"}}],
                                                size: 1
                                            }
                                        },
                                        oldest: {
                                            top_hits: {
                                                sort: [
                                                    {"@timestamp": {order: "asc"}}
                                                ],
                                                size: 1
                                            }
                                        },
                                        escalated: {
                                            filter: {term: {tags: "escalated"}}
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            },
            timeout: 1000
        };

        return this.search(query).then(response => {

            let events:any[] = [];

            // Unwrap from the buckets.
            response.aggregations.signatures.buckets.forEach((sig:any) => {
                sig.sources.buckets.forEach((source:any) => {
                    source.destinations.buckets.forEach((dest:any) => {

                        let event = {
                            count: dest.doc_count,
                            newest: dest.newest.hits.hits[0],
                            oldest: dest.oldest.hits.hits[0],
                            escalated: dest.escalated.doc_count
                        };

                        events.push(event);

                    })
                })
            });

            // Sort.
            events.sort((a, b) => {
                let x = moment(a.newest._source.timestamp);
                let y = moment(b.newest._source.timestamp);
                return y.diff(x);
            });

            return events;

        })
    }
}