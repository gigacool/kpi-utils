const { expect } = require('@jest/globals');

const issues = require('./issues');

describe('issues tests', () => {

  it('should export issues', () => {
    expect(issues).toBeDefined();
  });

  describe('convert history', () => {

  
    it('convertHistory should exist', () => {
      expect(issues._convertHistory).toBeDefined();
    });

    it('should convert simple example',()=>{
      // given
      let history = {
        values: [
          {
            id: '1',
            created:'2021-01-01T00:00:00.000+0000',
            items:[
              {field:'some field', from:'1', to:'2', fromString:'val1', toString:'val2'}
            ]
          }
        ]
      }
      // when
      let result = issues._convertHistory(history);
      // then 
      expect(result.length).toBe(0);
    });

    it('should convert simple example',()=>{
      // given
      let history = {
        values: [
          {
            created:'2021-01-02T00:00:00.000+0000',
            items:[
              {field:'status', fromString:'state2', toString:'state3'},
              {field:'some field', fromString:'val1', toString:'val2'},
            ]
          },
          {
            created:'2021-01-01T00:00:00.000+0000',
            items:[
              {field:'some field', fromString:'val1', toString:'val2'},
              {field:'status', fromString:'state1', toString:'state2'},
            ]
          }

        ]
      }
      // when
      let result = issues._convertHistory(history);
      // then 
      expect(result.length).toBe(2);
      expect(result[0]).toMatchObject({from:'state1', to:'state2', date:'2021-01-01T00:00:00.000+0000'})
      expect(result[1]).toMatchObject({from:'state2', to:'state3', date:'2021-01-02T00:00:00.000+0000'})
    });

  });
});
