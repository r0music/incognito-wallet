import React from 'react';
import { View } from 'react-native';
import { styled } from './Template.styled';

const Template = (props) => {
  return <View style={styled.container} />;
};

Template.propTypes = {};

export default React.memo(Template);
