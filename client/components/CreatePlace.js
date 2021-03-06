import React, { Component } from 'react'
import { View } from 'react-native'
import { Mutation } from 'react-apollo'
import { Button, FormLabel, FormInput } from 'react-native-elements'

import AddressSearchInput from './AddressSearchInput'

import { CREATE_PLACE_MUTATION } from '../queries/Place'

class CreatePlace extends Component {
  state = {
    address: null,
    isLoading: false,
    name: '',
  }

  handleAddressChange = (data, place) => {
    const { getParsedAddress } = this.props
    const address = getParsedAddress(place)

    this.setState({ address })
  }

  handleCreatePlace = createPlaceMutation => {
    const { address, name } = this.state
    const { allPlacesQuery } = this.props
    const { geoCoordinates } = address

    this.setState({
      isLoading: true,
    })

    if (createPlaceMutation) {
      createPlaceMutation({
        variables: {
          name,
          ...address,
          ...geoCoordinates,
        },
      }).then(() => allPlacesQuery.refetch())
    }
  }

  render() {
    const { handleAddressChange, handleCreatePlace, state } = this
    const { address, isLoading } = state

    return (
      <View>
        <FormLabel>Name</FormLabel>
        <FormInput
          autoFocus={true}
          onChangeText={name => this.setState({ name })}
        />

        <FormLabel>Address</FormLabel>

        <View
          style={{
            width: '100%',
            height: '50%',
            alignItems: 'center',
            borderRadius: 8,
            backgroundColor: '#f4f4f4',
          }}
        >
          <AddressSearchInput onAddressChange={handleAddressChange} />
        </View>

        <Mutation mutation={CREATE_PLACE_MUTATION}>
          {createPlaceMutation => (
            <Button
              loading={isLoading}
              loadingProps={{ size: 'large', color: '#009688' }}
              backgroundColor="#009688"
              onPress={
                address
                  ? () => handleCreatePlace(createPlaceMutation)
                  : () => false
              }
              title="create place"
              style={{ marginTop: 20 }}
            />
          )}
        </Mutation>
      </View>
    )
  }
}

export default CreatePlace
