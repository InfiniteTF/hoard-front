/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: Search
// ====================================================

export interface Search_search {
  uuid: any;
  id: number;
  name: string;
  displayName: string;
  disambiguation: string;
  photoUrl: string | null;
  gender: string;
}

export interface Search {
  search: Search_search[];
}

export interface SearchVariables {
  term: string;
}
