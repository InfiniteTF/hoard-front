/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { UpdatePerformer } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: UpdatePerformerMutation
// ====================================================

export interface UpdatePerformerMutation_updatePerformer {
  id: number;
  uuid: any;
  waistSize: number | null;
  tattoos: string[] | null;
  piercings: string[] | null;
  photoUrl: string | null;
  name: string;
  location: string | null;
  hipSize: number | null;
  height: number | null;
  hairColor: string | null;
  gender: string;
  eyeColor: string | null;
  ethnicity: string | null;
  disambiguation: string;
  countryId: number | null;
  careerStart: number | null;
  careerEnd: number | null;
  cupSize: string | null;
  bandSize: number | null;
  boobJob: string | null;
  birthdateAccuracy: number | null;
  birthdate: any | null;
}

export interface UpdatePerformerMutation {
  updatePerformer: UpdatePerformerMutation_updatePerformer;
}

export interface UpdatePerformerMutationVariables {
  performerId: number;
  performerData: UpdatePerformer;
}
