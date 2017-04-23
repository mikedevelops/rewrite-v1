import { expect } from 'chai'
import { describe, it, beforeEach } from 'mocha'
import { useFakeXMLHttpRequest } from 'sinon'
import * as xhrHelpers from 'Helpers/xhr.helper'

describe('XHR helpers', () => {
    beforeEach(() => {
        global.XMLHttpRequest = useFakeXMLHttpRequest()
    })

    describe('request()', () => {
        it('should return a promise', () => {
            expect(xhrHelpers.request('http://localhost')).to.be.a('promise')
        })
    })
})
