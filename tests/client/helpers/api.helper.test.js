import { expect } from 'chai'
import { describe, it, beforeEach } from 'mocha'
import { useFakeXMLHttpRequest } from 'sinon'
import * as apiHelpers from 'Helpers/api.helper'

describe('Api helpers', () => {
    beforeEach(() => {
        global.XMLHttpRequest = useFakeXMLHttpRequest()
    })

    it('should return a promise', () => {
        describe('request()', () => {
            it('should return a promise', () => {
                expect(apiHelpers.apiGet('http://localhost')).to.be.a('promise')
            })
        })
    })
})
