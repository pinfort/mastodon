# frozen_string_literal: true

describe 'Area url redirect to top' do
    describe 'with no area id' do
        it 'areas redirect to top' do
            get '/areas'

            expect(response).to redirect_to('/')
        end
    end

    describe 'aith area id' do
        it 'areas redirect to top' do
            get '/areas/foofoo'

            expect(response).to redirect_to('/')
        end
    end
end
