const fs = require('fs');
const http = require('http');
const url = require('url');
const slugify = require('slugify');

//SERVER
function replaceTemplate(temp, product) {
    let output = temp.replace(/{%PRODUCTNAME%}/g, product.productName);
    output = output.replace(/{%IMAGE%}/g, product.image);
    output = output.replace(/{%PRICE%}/g, product.price);
    output = output.replace(/{%FROM%}/g, product.from);
    output = output.replace(/{%NUTITIONS%}/g, product.nutrition);
    output = output.replace(/{%QUANTITY%}/g, product.quantity);
    output = output.replace(/{%DESCRIPTION%}/g, product.description);
    output = output.replace(/{%ID%}/g, product.id);

    console.log(product.organic);

    if (!product.organic)
        output = output.replace(/{%NOT_ORGANIC%}/g, 'not-organic');
    return output;
}

const tempOverview = fs.readFileSync(`${__dirname}/templateS/template-overview.html`, 'utf-8');
const tempProduct = fs.readFileSync(`${__dirname}/templateS/template-product.html`, 'utf-8');
const tempCard = fs.readFileSync(`${__dirname}/templateS/template-card.html`, 'utf-8');

const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8');
const dataObj = JSON.parse(data);
const slugs = dataObj.map(el => slugify(el.productName, {lower : true}));
console.log(slugs);
const server = http.createServer((req, res) => {

const {query, pathname} = url.parse(req.url, true);


// Overview Page
    if(pathname === '/' || pathname == '/overview'){
        res.writeHead(200, {'content-type' : 'text/html'});

        const cardsHtml = dataObj.map(el => replaceTemplate(tempCard, el)).join('');
        const output = tempOverview.replace('{%PRODUCT_CARDS%}', cardsHtml);
        res.end(output);
        console.log(cardsHtml);
       // res.end(tempOverview);

// Product Page
    } else if(pathname === '/product'){
        res.writeHead(200, {'content-type' : 'text/html'});
        const product = dataObj[query.id];
        const output = replaceTemplate(tempProduct, product);
        res.end(output);

// API
    } else if(pathname === '/api') {
        res.writeHead(200, {'content-type' : 'application/json'});
        res.end(data);
// Page NOT FOUND
    } else {
        res.writeHead(404, {
            'Content-type' : 'text/html',
            'my-own-header' : 'nodejs',

        });
        res.end('<h1> Page not found!! </h1>');
    }
});

server.listen(8000, '127.0.0.1', () => {
    console.log('listening on port 8000');
})
