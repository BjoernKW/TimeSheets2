import {
  describe,
  beforeEachProviders
} from 'angular2/testing_internal';
import {Component, View, provide, DirectiveResolver} from 'angular2/core';

import {Location, Router, RouteRegistry, ROUTER_PRIMARY_COMPONENT} from 'angular2/router';
import {SpyLocation} from 'angular2/src/mock/location_mock';
import {RootRouter} from 'angular2/src/router/router';

import {AppCmp} from './app';

export function main() {

  describe('App component', () => {

    // Support for testing component that uses Router
    beforeEachProviders(() => [
      RouteRegistry,
      DirectiveResolver,
      provide(Location, {useClass: SpyLocation}),
      provide(ROUTER_PRIMARY_COMPONENT, {useValue: AppCmp}),
      provide(Router, {useClass: RootRouter})
    ]);
  });
}

@Component({selector: 'test-cmp'})
@View({directives: [AppCmp]})
class TestComponent {}
