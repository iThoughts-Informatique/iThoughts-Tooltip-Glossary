export const mount = jest.fn();
export const TipForm = function() {
	return TipFormCtor();
};
TipForm.mount = mount;
export const TipFormCtor = jest.fn().mockReturnValue( TipForm );
