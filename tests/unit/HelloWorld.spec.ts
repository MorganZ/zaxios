import { shallowMount } from "@vue/test-utils";
import HelloWorld from "@/components/HelloWorld.vue";
import axios from "axios";
import { AxiosManagerStatic, AxiosLogger, AxiosQueryInfo } from "@/lib/index";

describe("HelloWorld.vue", () => {
  it("renders props.msg when passed", () => {
    const msg = "new message";
    const wrapper = shallowMount(HelloWorld, {
      propsData: { msg }
    });
    expect(wrapper.text()).toMatch(msg);
  });
});

describe("setup interceptor", () => {
  it("test registration ", done => {
    let md = {};
    AxiosManagerStatic.addMiddleWear(
      new AxiosQueryInfo(meta => {
        md = meta;
        console.log(md);
        expect(md).toMatch({ test: 2 });
      })
    );
    AxiosManagerStatic.axios
      .get("http://localhost:4000/api/one", { responseType: 'json', meta: { test: 2 })
      .then(result => {
        console.log(result);
        done();
      });
  });
});
