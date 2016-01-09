import {
} from 'angular2/testing_internal';
import {Component, View} from 'angular2/core';
import {HomeCmp} from './home';

@Component({selector: 'test-cmp'})
@View({directives: [HomeCmp]})
class TestComponent {}
