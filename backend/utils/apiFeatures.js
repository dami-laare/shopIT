class APIFeatures {
    constructor(query, queryStr){
        this.query = query;
        this.queryStr = queryStr;
    }

    search() {
        const keyword = this.queryStr.keyword ? {
            name: {
                $regex: this.queryStr.keyword,
                $options: 'i'
            }
        } : {};

        this.query = this.query.find({...keyword})
        return this;
    }

    filter() {
        let queryCopy = {...this.queryStr};

        // Removing fields not in the document from queryCopy
        const removedFields = ['keyword', 'limit', 'page'];
        removedFields.forEach(field => delete queryCopy[field]);
        
        // Handling ranged search for price and ratings etc
        let queryStr = JSON.stringify(queryCopy);

        // Add a dollar sign before the normal Mongodb operators
        queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g, match => `$${match}`)
        queryCopy = JSON.parse(queryStr)

        this.query = this.query.find(queryCopy)
        return this
    }

    pagination(resPerPage) {
        let currPage = Number(this.queryStr.page);

        let skip = resPerPage * (currPage-1);

        this.query = this.query.limit(resPerPage).skip(skip)

        return this
    }
}


module.exports = APIFeatures;