"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QueryAPI = void 0;
class QueryAPI {
    constructor(queryStrings, resourceSchema, resourceModel) {
        this.queryStrings = queryStrings;
        this.resourceSchema = resourceSchema;
        this.resourceModel = resourceModel;
    }
    filter() {
        //1. Basic Filtering /////////////////////////////
        //    Take a copy of all the queryStrings
        const filters = Object.assign({}, this.queryStrings);
        //    Filter out any non schema query
        Object.keys(filters).forEach((key) => {
            var _a, _b;
            if (!((_b = (_a = this.resourceSchema) === null || _a === void 0 ? void 0 : _a.obj) === null || _b === void 0 ? void 0 : _b[key]))
                delete filters[key];
            //2.  Advanced Filtering ///////////////////////
            //Considering gt,gte,lt,lte,ne
            if (typeof filters[key] === "object") {
                let operatorName = Object.keys(filters[key])[0];
                // check if the operator is a regular expression operator
                const operatorValue = operatorName === "regex"
                    ? new RegExp(filters[key][operatorName], "i")
                    : filters[key][operatorName];
                delete filters[key][operatorName];
                operatorName = `$${operatorName}`;
                filters[key][operatorName] = operatorValue;
            }
        });
        //    Construct the query
        this.query = this.resourceModel.find(filters);
        return this;
    }
    sort() {
        const sortCriteria = this.queryStrings.sort;
        if (sortCriteria) {
            this.query = this.query.sort(sortCriteria.replace(",", " "));
        }
        else {
            this.query = this.query.sort("-createdAt");
        }
        return this;
    }
    paginate() {
        // Set default page and limit
        const page = this.queryStrings.page ? +this.queryStrings.page : 1;
        const limit = this.queryStrings.limit
            ? +this.queryStrings.limit
            : 9;
        const skippedDocsCount = limit * (page - 1);
        // Skip the first number of page (Zero based) fields and then limit the number of rows
        this.query = this.query.skip(skippedDocsCount).limit(limit);
        return this;
    }
    select() {
        const selectedFields = this.queryStrings.fields;
        if (selectedFields) {
            this.query = this.query.select(selectedFields.split(",").join(" "));
        }
        else {
            this.query = this.query.select("-__v");
        }
        return this;
    }
}
exports.QueryAPI = QueryAPI;
//# sourceMappingURL=QueryAPI.js.map