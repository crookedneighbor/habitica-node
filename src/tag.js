// Tag
// tags
// Sort thy stuff!
export default class {
  constructor (option) {
    this._connection = option.connection;
    
    this.delete = this.del;
  }
  
  // # tag.get()
  // Get your tags.
  //
  // If no arguments are passed in, all the tags are returned.
  //
  // ```js
  // api.tag.get()
  //   .then((tags) => {
  //     tags[0]; // one of your tasks
  //   });
  // ```
  //
  // If you pass in a tag id, it will get that specific tag.
  //
  // ```js
  // api.tag.get('id-of-your-tag')
  //   .then((tag) => {
  //     tag.name; // the tag name
  //     tag.id; // the tag id
  //   });
  // ```
  get (id) {
    let url = 'user/tags';
    
    if (id) {
      url += `/${id}`;
    }
    
    return this._connection.get(url)
      .then((tags) => {
        return tags;
      })
      .catch((err) => {
        throw err;
      });
  }
  
  // # tag.post()
  // Create a new tag
  //
  // Takes the tag object as an argument
  //
  // ```js
  // api.tag.post({
  //  name: 'tag name',
  // }).then((tags) => {
  //   tags; // it returns all of the existing tags
  // });
  // ```
  post (tagBody) {
    return this._connection.post(
        'user/tags',
        { send: tagBody}
      ).then((tag) => {
        return tag;
      })
      .catch((err) => {
        throw err;
      });
  }
  
  // # tag.put()
  // Update an existing tag
  //
  // tag id and tag body are required arguments.
  //
  // ```js
  // api.tag.put(
  //   'tag-id',
  //   { name: 'new tag name' }
  // ).then((tag) => {
  //   tag.name; // 'new tag name'
  // });
  // ```
  put (id, tagBody) {
    if (!id) throw 'Tag id is required';
    if (!tagBody) throw 'Tag body is required';
    
    return this._connection.put(
        `user/tags/${id}`,
        { send: tagBody }
      ).then((tag) => {
        return tag;
      })
      .catch((err) => {
        throw err;
      });
  }
  
  // # tag.del()
  // Delete existing tag.
  //
  // Tag id is a required argument.
  //
  // ```js
  // api.tag.del(
  //   'tag-id',
  // ).then((tags) => {
  //   tags; // remaining existing tags
  // });
  // ```
  del (id) {
    if (!id) throw 'Tag id is required';

    return this._connection.del(`user/tags/${id}`)
      .then((tags) => {
        return tags;
      })
      .catch((err) => {
        throw err;
      });
  }
  
}