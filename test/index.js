var chai = require('chai');
var expect = chai.expect;
var sinon = require('sinon');
var Promise = require('bluebird');
var _ = require('lodash');
var Interfake = require('interfake');
var interfake = new Interfake();
var BASE_HEADER = {'service-type': 'Doron-Service'};
var GET_HEADER = { 'type': 'get-test-header' };
var POST_HEADER = { 'type': 'post-test-header' };
var request = require('../')(Promise, {
	headers: {
		base: BASE_HEADER,
		get: GET_HEADER,
		post: POST_HEADER
	}
});
var PORT = 9987;
interfake.get('/good').body({code: 'ok'});
interfake.post('/good').body({code: 'ok'});
interfake.get('/bad').status(400).body({code: 'error', error: 'error'});
interfake.get('/not-found').status(404).body({error: 'not found'});
interfake.listen(PORT);

describe('OT-SuperAgent-Promise', function(){
	describe('Request Object', function(){
		it('Request Should exist', function(){
			expect(request).to.exist;
		});
	});

	describe('When [GET] /good', function(){
		it('Should return a promise', function(done){
			request.get('localhost:' + 9987 + '/good')
			.then(function(res){
				expect(res.req._header).to.contains(BASE_HEADER['service-type']);
				expect(res.req._header).to.contains(GET_HEADER.type);
				expect(res).to.exist;
        expect(res.status).to.equal(200);
        expect(res.body.code).to.equal('ok');
        done();
			}).catch(function(e){
				done();
			});
		});
	});

	describe('When [POST] /good', function(){
		it('Should return a promise', function(done){
			request.post('localhost:' + 9987 + '/good')
			.then(function(res){
				expect(res.req._header).to.contains(BASE_HEADER['service-type']);
				expect(res.req._header).to.contains(POST_HEADER.type);
				expect(res).to.exist;
        expect(res.status).to.equal(200);
        expect(res.body.code).to.equal('ok');
        done();
			}).catch(function(e){
				done();
			});
		});
	});

	describe('When [GET] /bad', function(){
		it('Should return a promise', function(done){
			request.get('localhost:' + 9987 + '/bad')
			.then(function(res){
				expect(res).to.not.exist;
				done();
			}).catch(function(e){
				expect(e).to.exist;
				expect(e.res.req._header).to.contains(BASE_HEADER['service-type']);
				expect(e.res.req._header).to.contains(GET_HEADER['type']);
				done();
			});
		});
	});

	describe('When [GET] /not-found', function(){
		it('Should reject an error', function(done){
			request.get('localhost:' + 9987 + '/not-found')
			.then(function(res){
				expect(res).to.not.exist;
				done();
			}).catch(function(error){
				expect(error).to.exist;
        expect(error.res).to.exist;
        expect(error.status).to.exist;
        expect(error.body).to.exist;
        expect(error).to.be.instanceof(Error);
        expect(error.name).to.equal("SuperagentPromiseError");
        done();
			});
		});
	});
});
