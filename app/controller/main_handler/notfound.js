const notFound = async function (opt) {
    const { ctx, service, config, typeObj } = opt;
    console.log(typeObj);
    const findTagsRes = await service.config.findOne({"alias": "tags"});
    let tags = [];
    findTagsRes.info.forEach((tag)=>{
        if ( tag !== '' && tag !== ' ' ) {
            tags.push(tag);
        }
    });

    this.publicData.tags = tags;
    console.log(this.publicData.tags);

    let data = {
        publicData: this.publicData,
        typeObj: {
            type: 404
        }
    };

    await this.render('/pages/404', data);
}

module.exports = notFound;