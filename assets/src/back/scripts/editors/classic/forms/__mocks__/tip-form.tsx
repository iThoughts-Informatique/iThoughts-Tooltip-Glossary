export const selfMount = jest.fn();
export const TipForm = function() {
	return TipFormCtor();
};
TipForm.selfMount = selfMount;
export const TipFormCtor = jest.fn().mockReturnValue( TipForm );
